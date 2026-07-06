import { Button, Input } from '@/components';
import { ScreenHeader } from '@/components/screen-header';
import { SelectField } from '@/components/select-field';
import { fonts } from '@/config/fonts';
import { useTheme } from '@/config/theme';
import { pickImageFromLibrary } from '@/lib/pick-image';
import { useApolloClient } from '@apollo/client/react';
import { Ionicons } from '@expo/vector-icons';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useCallback, useEffect, useMemo, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  Image,
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { showMessage } from 'react-native-flash-message';
import {
  Hooks,
  Types,
  useCreateWellnessProgram,
  useDoctorUser,
  useLifestyleCategories,
  useUpdateWellnessProgram,
  useViewUrl,
  type LifestyleCategoryItem,
} from '@repo/ui/graphql';

const ACCENT = '#20BEB8';

const DIFFICULTY_OPTIONS = ['Beginner', 'Intermediate', 'Advanced'] as const;
const DIFFICULTY_MAP: Record<(typeof DIFFICULTY_OPTIONS)[number], Types.DifficultyLevel> = {
  Beginner: Types.DifficultyLevel.Beginner,
  Intermediate: Types.DifficultyLevel.Intermediate,
  Advanced: Types.DifficultyLevel.Advanced,
};

const ACCESS_OPTIONS = ['Free', 'Premium'] as const;
const ACCESS_MAP: Record<(typeof ACCESS_OPTIONS)[number], Types.AccessLevel> = {
  Free: Types.AccessLevel.Free,
  Premium: Types.AccessLevel.Premium,
};

const PUBLISH_OPTIONS = ['Draft', 'Published', 'Archived'] as const;
const PUBLISH_MAP: Record<(typeof PUBLISH_OPTIONS)[number], Types.PublishStatus> = {
  Draft: Types.PublishStatus.Draft,
  Published: Types.PublishStatus.Published,
  Archived: Types.PublishStatus.Archived,
};

const REVERSE_DIFFICULTY_MAP: Record<Types.DifficultyLevel, (typeof DIFFICULTY_OPTIONS)[number]> = {
  [Types.DifficultyLevel.Beginner]: 'Beginner',
  [Types.DifficultyLevel.Intermediate]: 'Intermediate',
  [Types.DifficultyLevel.Advanced]: 'Advanced',
};

const REVERSE_ACCESS_MAP: Record<Types.AccessLevel, (typeof ACCESS_OPTIONS)[number]> = {
  [Types.AccessLevel.Free]: 'Free',
  [Types.AccessLevel.Premium]: 'Premium',
};

const REVERSE_PUBLISH_MAP: Record<Types.PublishStatus, (typeof PUBLISH_OPTIONS)[number]> = {
  [Types.PublishStatus.Draft]: 'Draft',
  [Types.PublishStatus.Published]: 'Published',
  [Types.PublishStatus.Archived]: 'Archived',
};

type CategorySelectFieldProps = {
  theme: ReturnType<typeof useTheme>;
  label: string;
  value: LifestyleCategoryItem | null;
  placeholder: string;
  options: LifestyleCategoryItem[];
  loading?: boolean;
  error?: boolean;
  onChange: (category: LifestyleCategoryItem) => void;
};

function CategorySelectField({
  theme,
  label,
  value,
  placeholder,
  options,
  loading,
  error,
  onChange,
}: CategorySelectFieldProps) {
  const [open, setOpen] = useState(false);

  return (
    <View style={styles.fieldBlock}>
      <Text style={[styles.fieldLabel, { color: theme.inputLabel }]}>{label}</Text>
      <Pressable
        onPress={() => !loading && setOpen(true)}
        style={[
          styles.selectField,
          {
            backgroundColor: theme.inputBg,
            borderColor: theme.inputBorder,
          },
        ]}>
        {loading ? (
          <ActivityIndicator size="small" color={ACCENT} />
        ) : (
          <>
            <Text
              style={[
                styles.selectFieldText,
                { color: value ? theme.inputText : theme.inputPlaceholder },
              ]}>
              {value?.name || placeholder}
            </Text>
            <Ionicons name="chevron-down" size={20} color={theme.textMuted} />
          </>
        )}
      </Pressable>

      <Modal visible={open} transparent animationType="fade">
        <Pressable style={styles.modalOverlay} onPress={() => setOpen(false)}>
          <View
            style={[styles.modalSheet, { backgroundColor: theme.card }]}
            onStartShouldSetResponder={() => true}>
            <FlatList
              data={options}
              keyExtractor={(item) => item.id}
              ListEmptyComponent={
                <Text style={[styles.emptyCategories, { color: theme.textSecondary }]}>
                  {error ? 'Unable to load categories' : 'No categories available'}
                </Text>
              }
              renderItem={({ item }) => (
                <Pressable
                  style={styles.modalOption}
                  onPress={() => {
                    onChange(item);
                    setOpen(false);
                  }}>
                  <Text style={[styles.modalOptionText, { color: theme.textPrimary }]}>
                    {item.name}
                  </Text>
                  {item.description ? (
                    <Text
                      style={[styles.modalOptionDescription, { color: theme.textSecondary }]}
                      numberOfLines={2}>
                      {item.description}
                    </Text>
                  ) : null}
                </Pressable>
              )}
            />
          </View>
        </Pressable>
      </Modal>
    </View>
  );
}

export default function CreateWellnessProgramScreen() {
  const theme = useTheme();
  const router = useRouter();
  const { id: programId } = useLocalSearchParams<{ id?: string }>();
  const isEditing = Boolean(programId);
  const client = useApolloClient();
  const { createWellnessProgram, loading: creating } = useCreateWellnessProgram();
  const { updateWellnessProgram, loading: updating } = useUpdateWellnessProgram();
  const submitting = creating || updating;
  const { user } = useDoctorUser();
  const { categories, loading: categoriesLoading, error: categoriesError } =
    useLifestyleCategories(true);
  const { data: programData, loading: programLoading } = Hooks.useGetWellnessProgramQuery({
    skip: !programId,
    variables: { id: programId! },
    fetchPolicy: 'cache-and-network',
  });
  const existingProgram = programData?.getWellnessProgram ?? null;

  useEffect(() => {
    if (!user) return;
    console.log(
      'getUser response',
      JSON.stringify(
        { id: user.id, email: user.email, role: user.role },
        null,
        2,
      ),
    );
  }, [user]);

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [durationWeeks, setDurationWeeks] = useState('');
  const [targetAudience, setTargetAudience] = useState('');
  const [difficulty, setDifficulty] = useState<(typeof DIFFICULTY_OPTIONS)[number]>('Beginner');
  const [accessLevel, setAccessLevel] = useState<(typeof ACCESS_OPTIONS)[number]>('Free');
  const [publishStatus, setPublishStatus] = useState<(typeof PUBLISH_OPTIONS)[number]>('Draft');
  const [category, setCategory] = useState<LifestyleCategoryItem | null>(null);
  const [coverPreviewUri, setCoverPreviewUri] = useState<string | null>(null);
  const [coverImageFileId, setCoverImageFileId] = useState<string | null>(null);
  const [uploadingCover, setUploadingCover] = useState(false);
  const [formInitialized, setFormInitialized] = useState(false);

  const existingCoverKey = existingProgram?.coverImage?.key;
  const { url: existingCoverUrl } = useViewUrl(
    isEditing && !coverPreviewUri ? existingCoverKey : null,
  );
  const coverDisplayUri = coverPreviewUri ?? existingCoverUrl;

  useEffect(() => {
    setFormInitialized(false);
  }, [programId]);

  useEffect(() => {
    if (!isEditing || !existingProgram || formInitialized) return;

    setTitle(existingProgram.title);
    setDescription(existingProgram.description ?? '');
    setDurationWeeks(String(existingProgram.durationWeeks));
    setTargetAudience(existingProgram.targetAudience ?? '');
    setDifficulty(REVERSE_DIFFICULTY_MAP[existingProgram.difficulty]);
    setAccessLevel(REVERSE_ACCESS_MAP[existingProgram.accessLevel]);
    setPublishStatus(REVERSE_PUBLISH_MAP[existingProgram.publishStatus]);
    setCoverImageFileId(existingProgram.coverImage?.id ?? null);
    setFormInitialized(true);
  }, [existingProgram, formInitialized, isEditing]);

  useEffect(() => {
    if (!formInitialized || !existingProgram?.category?.id || categories.length === 0) return;

    const matchedCategory = categories.find(
      (item) => item.id === existingProgram.category?.id,
    );
    if (matchedCategory) {
      setCategory(matchedCategory);
    }
  }, [categories, existingProgram?.category?.id, formInitialized]);

  const parsedDuration = Number.parseInt(durationWeeks, 10);
  const durationValid = Number.isFinite(parsedDuration) && parsedDuration > 0;
  const canSubmit =
    title.trim().length > 0 &&
    durationValid &&
    !submitting &&
    !uploadingCover &&
    (!isEditing || formInitialized);

  const uploadCoverImage = useCallback(
    async (uri: string, filename: string, mimeType: string) => {
      const fileRes = await fetch(uri);
      if (!fileRes.ok) {
        throw new Error('Unable to read selected image');
      }
      const body = await fileRes.blob();
      const fileType = mimeType || body.type || 'image/jpeg';

      const initResult = await client.mutate({
        mutation: Types.InitiateUploadDocument,
        variables: {
          input: {
            type: Types.FileTypeEnum.ProfilePicture,
            filename,
            size: body.size,
          },
        },
      });

      const presignedUrl = initResult.data?.initiateUpload?.presignedUrl;
      const key = initResult.data?.initiateUpload?.key;
      if (!presignedUrl || !key) {
        throw new Error('Unable to initiate cover image upload');
      }

      const putRes = await fetch(presignedUrl, {
        method: 'PUT',
        headers: { 'Content-Type': fileType },
        body,
      });
      if (!putRes.ok) {
        throw new Error(`Cover image upload failed (${putRes.status})`);
      }

      const confirmResult = await client.mutate({
        mutation: Types.ConfirmUploadDocument,
        variables: { key },
      });

      const fileId = confirmResult.data?.confirmUpload?.id;
      if (!fileId) {
        throw new Error('Unable to confirm cover image upload');
      }

      return fileId;
    },
    [client],
  );

  const handlePickCoverImage = async () => {
    if (uploadingCover || submitting) return;

    setUploadingCover(true);

    try {
      const picked = await pickImageFromLibrary({
        mediaTypes: ['images'],
        allowsEditing: true,
        aspect: [16, 9],
        quality: 0.85,
      });

      if (!picked) {
        setUploadingCover(false);
        return;
      }

      setCoverPreviewUri(picked.uri);
      const fileId = await uploadCoverImage(picked.uri, picked.filename, picked.mimeType);
      setCoverImageFileId(fileId);
    } catch (e: unknown) {
      setCoverPreviewUri(null);
      setCoverImageFileId(null);
      const message = e instanceof Error ? e.message : 'Cover image upload failed';
      showMessage({ message, type: 'danger', duration: 4000 });
    } finally {
      setUploadingCover(false);
    }
  };

  const handleSubmit = async () => {
    if (!title.trim()) {
      showMessage({ message: 'Title is required', type: 'danger', duration: 4000 });
      return;
    }
    if (!durationValid) {
      showMessage({
        message: 'Enter a valid duration in weeks',
        type: 'danger',
        duration: 4000,
      });
      return;
    }

    try {
      const input = {
        title: title.trim(),
        description: description.trim() || undefined,
        durationWeeks: parsedDuration,
        difficulty: DIFFICULTY_MAP[difficulty],
        accessLevel: ACCESS_MAP[accessLevel],
        publishStatus: PUBLISH_MAP[publishStatus],
        targetAudience: targetAudience.trim() || undefined,
        categoryId: category?.id,
        coverImageFileId: coverImageFileId ?? undefined,
      };

      if (isEditing && programId) {
        const { data } = await updateWellnessProgram({
          id: programId,
          ...input,
        });

        console.log(
          'updateWellnessProgram response',
          JSON.stringify(data, null, 2),
        );

        if (!data?.updateWellnessProgram?.id) return;

        showMessage({
          message: 'Wellness program updated',
          type: 'success',
          duration: 4000,
        });
        router.back();
        return;
      }

      const { data } = await createWellnessProgram(input);

      console.log(
        'createWellnessProgram response',
        JSON.stringify(data, null, 2),
      );

      if (!data?.createWellnessProgram?.id) return;

      showMessage({
        message: 'Wellness program created',
        type: 'success',
        duration: 4000,
      });
      router.back();
    } catch (e: unknown) {
      const message =
        e instanceof Error
          ? e.message
          : isEditing
            ? 'Could not update wellness program'
            : 'Could not create wellness program';
      showMessage({ message, type: 'danger', duration: 4000 });
    }
  };

  const coverLabel = useMemo(() => {
    if (uploadingCover) return 'Uploading cover image…';
    if (coverDisplayUri) return 'Change cover image';
    return 'Add cover image';
  }, [coverDisplayUri, uploadingCover]);

  if (isEditing && programLoading && !formInitialized) {
    return (
      <SafeAreaView style={[styles.safe, styles.loadingScreen, { backgroundColor: theme.background }]}>
        <ActivityIndicator size="large" color={ACCENT} />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: theme.background }]} edges={['top', 'bottom']}>
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
        <ScrollView
          style={styles.flex}
          contentContainerStyle={styles.scroll}
          keyboardShouldPersistTaps="handled"
          keyboardDismissMode="on-drag"
          showsVerticalScrollIndicator={false}>
          <ScreenHeader
            theme={theme}
            title={isEditing ? 'Edit Wellness Program' : 'Create Wellness Program'}
          />
          <Text style={[styles.subtitle, { color: theme.textSecondary, fontFamily: fonts.regular }]}>
            {isEditing
              ? 'Update your program details and publish settings.'
              : 'Share a structured program with your patients.'}
          </Text>

          <Input
            theme={theme}
            label="Title"
            placeholder="e.g. 4-Week Stress Relief Plan"
            value={title}
            onChangeText={setTitle}
            autoCapitalize="sentences"
          />

          <Input
            theme={theme}
            label="Description"
            placeholder="What will patients achieve?"
            value={description}
            onChangeText={setDescription}
            multiline
            numberOfLines={4}
            textAlignVertical="top"
            containerStyle={styles.descriptionInput}
          />

          <Input
            theme={theme}
            label="Duration (weeks)"
            placeholder="e.g. 4"
            value={durationWeeks}
            onChangeText={setDurationWeeks}
            keyboardType="number-pad"
          />

          <SelectField
            theme={theme}
            label="Difficulty"
            value={difficulty}
            placeholder="Select difficulty"
            options={[...DIFFICULTY_OPTIONS]}
            onChange={(value) => setDifficulty(value as (typeof DIFFICULTY_OPTIONS)[number])}
          />

          <SelectField
            theme={theme}
            label="Access level"
            value={accessLevel}
            placeholder="Select access level"
            options={[...ACCESS_OPTIONS]}
            onChange={(value) => setAccessLevel(value as (typeof ACCESS_OPTIONS)[number])}
          />

          <SelectField
            theme={theme}
            label="Publish status"
            value={publishStatus}
            placeholder="Select publish status"
            options={[...PUBLISH_OPTIONS]}
            onChange={(value) => setPublishStatus(value as (typeof PUBLISH_OPTIONS)[number])}
          />

          <CategorySelectField
            theme={theme}
            label="Category"
            value={category}
            placeholder="Select category"
            options={categories}
            loading={categoriesLoading}
            error={Boolean(categoriesError)}
            onChange={setCategory}
          />

          <Input
            theme={theme}
            label="Target audience"
            placeholder="e.g. Adults managing chronic stress"
            value={targetAudience}
            onChangeText={setTargetAudience}
            autoCapitalize="sentences"
          />

          <View style={styles.coverBlock}>
            <Text style={[styles.fieldLabel, { color: theme.inputLabel }]}>Cover image</Text>
            <Pressable
              onPress={handlePickCoverImage}
              disabled={uploadingCover || submitting}
              style={[
                styles.coverPicker,
                {
                  backgroundColor: theme.inputBg,
                  borderColor: theme.inputBorder,
                },
              ]}>
              {coverDisplayUri ? (
                <Image source={{ uri: coverDisplayUri }} style={styles.coverPreview} resizeMode="cover" />
              ) : (
                <View style={styles.coverPlaceholder}>
                  <Ionicons name="image-outline" size={28} color={theme.textMuted} />
                </View>
              )}
              <View style={styles.coverPickerFooter}>
                {uploadingCover ? (
                  <ActivityIndicator size="small" color={ACCENT} />
                ) : (
                  <Text style={[styles.coverPickerText, { color: theme.textPrimary, fontFamily: fonts.medium }]}>
                    {coverLabel}
                  </Text>
                )}
              </View>
            </Pressable>
          </View>

          <Button
            theme={theme}
            label={
              submitting
                ? isEditing
                  ? 'Saving…'
                  : 'Creating…'
                : isEditing
                  ? 'Save changes'
                  : 'Create program'
            }
            onPress={handleSubmit}
            disabled={!canSubmit}
            style={styles.submitButton}
          />
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
  },
  loadingScreen: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  flex: {
    flex: 1,
  },
  scroll: {
    flexGrow: 1,
    paddingHorizontal: 24,
    paddingBottom: 32,
  },
  subtitle: {
    fontSize: 14,
    marginBottom: 24,
  },
  fieldBlock: {
    marginBottom: 16,
  },
  fieldLabel: {
    fontSize: 14,
    marginBottom: 8,
    fontWeight: '500',
  },
  selectField: {
    minHeight: 48,
    borderRadius: 10,
    borderWidth: 1,
    paddingHorizontal: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  selectFieldText: {
    flex: 1,
    fontSize: 15,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.45)',
    justifyContent: 'flex-end',
  },
  modalSheet: {
    maxHeight: '50%',
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    paddingVertical: 8,
  },
  modalOption: {
    paddingVertical: 14,
    paddingHorizontal: 20,
  },
  modalOptionText: {
    fontSize: 16,
    fontWeight: '500',
  },
  modalOptionDescription: {
    fontSize: 13,
    marginTop: 4,
    lineHeight: 18,
  },
  emptyCategories: {
    paddingVertical: 20,
    paddingHorizontal: 20,
    fontSize: 15,
  },
  descriptionInput: {
    marginBottom: 16,
  },
  coverBlock: {
    marginBottom: 24,
  },
  coverPicker: {
    borderRadius: 12,
    borderWidth: 1,
    overflow: 'hidden',
  },
  coverPreview: {
    width: '100%',
    height: 160,
  },
  coverPlaceholder: {
    height: 160,
    alignItems: 'center',
    justifyContent: 'center',
  },
  coverPickerFooter: {
    minHeight: 48,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 12,
  },
  coverPickerText: {
    fontSize: 15,
  },
  submitButton: {
    backgroundColor: ACCENT,
    borderRadius: 30,
    marginBottom: 12,
  },
});
