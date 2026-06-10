import { Redirect } from 'expo-router';

export default function MakeAppointmentRedirect() {
  return <Redirect href='/doctors-list' />;
}
