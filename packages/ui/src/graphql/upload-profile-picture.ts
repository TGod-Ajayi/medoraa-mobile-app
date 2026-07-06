import type { ApolloClient } from '@apollo/client';
import {
  ConfirmUploadDocument,
  FileTypeEnum,
  GetUserDocument,
  InitiateUploadDocument,
  type ConfirmUploadMutation,
  type InitiateUploadMutation,
} from './modules/types';

export type ProfilePictureUploadParams = {
  /** Local file URI from image picker (`file://` / `content://` / `ph://`). */
  uri: string;
  /** Must match the PUT `Content-Type` and what the presigned URL expects (e.g. `image/jpeg`). */
  mimeType: string;
  /** Original filename for the file record (e.g. `avatar.jpg`). */
  filename: string;
};

/** Builds React Native `FormData` for a picked profile image. */
export function createProfilePictureFormData(
  params: ProfilePictureUploadParams
): FormData {
  const formData = new FormData();
  formData.append(
    'file',
    {
      uri: params.uri,
      type: params.mimeType,
      name: params.filename,
    } as unknown as Blob
  );
  return formData;
}

/**
 * Presigned S3-style upload pipeline:
 * 1. Package picked image in `FormData` (RN file reference)
 * 2. Read local file as a `Blob` (size used for `initiateUpload`)
 * 3. `initiateUpload` → presigned PUT URL + storage `key`
 * 4. HTTP PUT same `Blob` bytes to `presignedUrl` (not GraphQL)
 * 5. `confirmUpload(key)` → activates `FileEntity` and links profile picture for the current user
 * 6. Refetches `getUser` so `profilePhoto` returns a fresh GET URL
 */
export async function uploadProfilePicture(
  client: ApolloClient,
  params: ProfilePictureUploadParams
): Promise<ConfirmUploadMutation['confirmUpload']> {
  const formData = createProfilePictureFormData(params);
  void formData;

  const readRes = await fetch(params.uri);
  if (!readRes.ok) {
    throw new Error('Could not read the selected image from disk');
  }
  const body = await readRes.blob();
  const size = body.size;

  let initData: InitiateUploadMutation | undefined;
  try {
    const result = await client.mutate({
      mutation: InitiateUploadDocument,
      variables: {
        input: {
          type: FileTypeEnum.ProfilePicture,
          filename: params.filename,
          size,
        },
      },
    });
    initData = result.data;
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'initiateUpload failed';
    throw new Error(message);
  }

  const presignedUrl = initData?.initiateUpload?.presignedUrl;
  const key = initData?.initiateUpload?.key;
  if (!presignedUrl || !key) {
    throw new Error('initiateUpload returned no presigned URL or key');
  }

  const putRes = await fetch(presignedUrl, {
    method: 'PUT',
    headers: {
      'Content-Type': params.mimeType,
    },
    body,
  });

  if (!putRes.ok) {
    const hint = await putRes.text().catch(() => '');
    throw new Error(
      `Upload to storage failed (${putRes.status}). ${hint.slice(0, 200)}`.trim()
    );
  }

  let confirmData: ConfirmUploadMutation | undefined;
  try {
    const result = await client.mutate({
      mutation: ConfirmUploadDocument,
      variables: { key },
    });
    confirmData = result.data;
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'confirmUpload failed';
    throw new Error(message);
  }

  const file = confirmData?.confirmUpload;
  if (!file) {
    throw new Error('confirmUpload returned no file');
  }

  await client.refetchQueries({ include: [GetUserDocument] });

  return file;
}
