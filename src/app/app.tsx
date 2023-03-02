import { AppShell } from '@mantine/core';
import styled from 'styled-components';

// App Router
import { Session } from '@supabase/supabase-js';
import { createContext, useEffect, useState } from 'react';

import { supabase } from 'src/app/supabase/client';
import Router from './Router';
import { Group } from './types/supabase-type-extensions';
import { AppNavbar } from './nav/AppNavbar/AppNavbar';

const StyledApp = styled.div`
  // Your style here
`;

export const SessionContext = createContext<Session | null>(null);
export const GroupContext = createContext<Group[] | null>(null);

// Max width of the central content area
export const maxStackWidth = 800;

export function App() {
  const [session, setSession] = useState<Session | null>(null);
  const checkSession = async () => {
    const { data, error } = await supabase.auth.getSession();
    if (error) console.log(error);
    if (data) {
      setSession(data.session);
    }
  };

  const [groups, setGroupList] = useState<Group[] | null>(null);
  const getGroups = async () => {
    const { data, error } = await supabase.from('group').select('*');
    if (error) console.log(error);
    else {
      console.log('set group list');
      setGroupList(data);
    }
  };

  useEffect(() => {
    checkSession();
    getGroups();
  }, []);

  // Listen for changes to the session state and update the session state --> context
  supabase.auth.onAuthStateChange((_event, session) => {
    console.log('auth state changed');
    setSession(session);
  });

  // Using context to pass session to all components

  return (
    <StyledApp>
      <GroupContext.Provider value={groups}>
        <SessionContext.Provider value={session}>
          <AppShell
            padding="md"
            // header={<NavHeader session={session} />}
            navbar={<AppNavbar getGroups={getGroups} />}
            styles={(theme) => ({
              main: {
                backgroundColor:
                  theme.colorScheme === 'dark'
                    ? theme.colors.dark[8]
                    : theme.colors.gray[0],
              },
            })}
          >
            <Router session={session} getGroups={getGroups} />
          </AppShell>
        </SessionContext.Provider>
      </GroupContext.Provider>
    </StyledApp>
  );
}

export default App;
