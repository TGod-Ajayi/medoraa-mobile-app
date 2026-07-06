import { Redirect } from 'expo-router';

/** Profile editing lives on `/profile` with inline Edit mode. */
export default function EditProfileRedirect() {
  return <Redirect href='/profile' />;
}
