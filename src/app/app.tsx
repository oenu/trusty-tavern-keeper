import { AppShell, Button } from '@mantine/core';
import styled from 'styled-components';

// App Router
import { Session } from '@supabase/supabase-js';
import { useEffect, useState } from 'react';

import { supabase } from 'src/app/supabase/client';
import Router from './Router';
import { handleRegister } from 'src/app/features/auth/register';
import { AppNavbar } from 'src/app/features/nav/AppNavbar';

const StyledApp = styled.div`
  // Your style here
`;
export function App() {
  const [session, setSession] = useState<Session | null>(null);

  useEffect(() => {
    const checkSession = async () => {
      const session = await supabase.auth.getSession();
      if (session.data.session?.user) {
        console.log(session.data.session);
        setSession(session.data.session);
      } else {
        console.log('no session found');
      }
    };
    checkSession();
  }, []);

  supabase.auth.onAuthStateChange((_event, session) => {
    console.log('auth state changed');
    setSession(session);
  });

  const testSupabase = async () => {
    const user = (await supabase.auth.getUser()).data.user?.id;
    console.log(user);

    const { data, error } = await supabase.from('group').select('*');
    if (error) {
      console.log(error);
    } else {
      console.log(data);
    }
  };

  return (
    <StyledApp>
      <AppShell
        padding="md"
        // header={<NavHeader session={session} />}
        navbar={<AppNavbar session={session} />}
        styles={(theme) => ({
          main: {
            backgroundColor:
              theme.colorScheme === 'dark'
                ? theme.colors.dark[8]
                : theme.colors.gray[0],
          },
        })}
      >
        {/* Your application here */}
        <Router />
        <Button
          onClick={() => {
            handleRegister({ session });
          }}
        >
          Test Discord API
        </Button>
        <Button
          onClick={() => {
            supabase.auth.signOut();
          }}
        >
          Sign out
        </Button>
        <Button
          onClick={async () => {
            const { data, error } = await supabase.rpc('create_group', {
              name: 'testGroupName',
              intensity: 'Adventure',
            });

            if (error) {
              console.log(error);
            }
            console.log(data);
          }}
        >
          Create Group (test)
        </Button>
        <Button
          onClick={() => {
            testSupabase();
          }}
        >
          Get list of groups im in
        </Button>
      </AppShell>
    </StyledApp>
  );
}

export default App;
