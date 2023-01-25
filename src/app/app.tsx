import { AppShell, Button } from '@mantine/core';
import styled from 'styled-components';

// App Router
import { Session } from '@supabase/supabase-js';
import { useEffect, useState } from 'react';

import { supabase } from 'src/lib/supabase/client';
import Router from './Router';
import { handleRegister } from 'src/features/auth/register';
import { AppNavbar } from 'src/features/nav/AppNavbar';

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
      </AppShell>
    </StyledApp>
  );
}

export default App;
