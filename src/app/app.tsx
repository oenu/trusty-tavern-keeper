import { AppShell } from '@mantine/core';
import styled from 'styled-components';

// App Router
import { Session } from '@supabase/supabase-js';
import { createContext, useEffect, useState } from 'react';

import { supabase } from 'src/app/supabase/client';
import Router from './Router';
import { AppNavbar } from 'src/app/features/nav/AppNavbar/AppNavbar';

const StyledApp = styled.div`
  // Your style here
`;

export const SessionContext = createContext<Session | null>(null);

export function App() {
  const [session, setSession] = useState<Session | null>(null);

  const checkSession = async () => {
    const { data, error } = await supabase.auth.getSession();
    if (error) console.log(error);
    if (data) {
      setSession(data.session);
    }
  };

  useEffect(() => {
    checkSession();
  }, []);

  // Listen for changes to the session state and update the session state --> context
  supabase.auth.onAuthStateChange((_event, session) => {
    console.log('auth state changed');
    setSession(session);
  });

  // Using context to pass session to all components

  return (
    <StyledApp>
      <SessionContext.Provider value={session}>
        <AppShell
          padding="md"
          // header={<NavHeader session={session} />}
          navbar={<AppNavbar />}
          styles={(theme) => ({
            main: {
              backgroundColor:
                theme.colorScheme === 'dark'
                  ? theme.colors.dark[8]
                  : theme.colors.gray[0],
            },
          })}
        >
          {/*
        APP ENTRY POINT
        */}

          <Router session={session} />
        </AppShell>
      </SessionContext.Provider>
    </StyledApp>
  );
}

export default App;
