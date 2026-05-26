import { Redirect } from 'expo-router';

/**
 * Root index — always redirects to the loading screen.
 */
export default function Index() {
  return <Redirect href="/loading" />;
}
