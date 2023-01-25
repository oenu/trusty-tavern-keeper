import {
  //  ButtonProps,
  Button,
} from '@mantine/core';
import { OAuthResponse, Session } from '@supabase/supabase-js';

import { SiDiscord } from 'react-icons/si';
import { supabase } from 'src/lib/supabase/client';
import { signInWithDiscord } from 'src/features/auth/discord';

// Component to handle Discord login - shows sign in button if user is not logged in and sign out button if user is logged in
export function DiscordButton({
  path, // path to redirect to after login
  label, // whether to show the label "Sign in with Discord"
  callback, // callback function to run after login
  session,
}: {
  session: Session | null;
  path: string;
  label: boolean;
  callback: (response: OAuthResponse) => void;
}) {
  const handleLogin = async () => {
    const { error } = await signInWithDiscord(path);
    if (error) console.log('error', error);
  };

  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) console.log('error', error);
  };

  if (session) {
    return (
      <Button
        leftIcon={<SiDiscord size={16} />}
        onClick={handleLogout}
        sx={(theme) => ({
          backgroundColor: theme.colorScheme === 'dark' ? '#5865F2' : '#5865F2',
          '&:hover': {
            backgroundColor:
              theme.colorScheme === 'dark'
                ? theme.fn.lighten('#5865F2', 0.05)
                : theme.fn.darken('#5865F2', 0.05),
          },
        })}
      >
        Sign Out
      </Button>
    );
  } else
    return (
      <Button
        leftIcon={<SiDiscord size={16} />}
        onClick={handleLogin}
        sx={(theme) => ({
          backgroundColor: theme.colorScheme === 'dark' ? '#5865F2' : '#5865F2',
          '&:hover': {
            backgroundColor:
              theme.colorScheme === 'dark'
                ? theme.fn.lighten('#5865F2', 0.05)
                : theme.fn.darken('#5865F2', 0.05),
          },
        })}
      >
        {label ? 'Sign in with Discord' : null}
      </Button>
    );
}
