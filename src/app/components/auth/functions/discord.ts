import { OAuthResponse } from '@supabase/supabase-js';
import { supabase } from '../../../supabase/client';

const getURL = () => {
  let url =
    import.meta.env.VITE_PUBLIC_SITE_URL ?? // Set this to your site URL in production env.
    'http://localhost:4000/';
  // Make sure to include `https://` when not localhost.
  url = url.includes('http') ? url : `https://${url}`;
  // Make sure to including trailing `/`.
  url = url.charAt(url.length - 1) === '/' ? url : `${url}/`;
  return url;
};

export async function signInWithDiscord(path: string): Promise<OAuthResponse> {
  return await supabase.auth.signInWithOAuth({
    provider: 'discord',

    options: {
      scopes: 'identify',
      redirectTo: getURL() + path,
    },
  });
}

export async function signOut(): Promise<void> {
  await supabase.auth.signOut();
}
