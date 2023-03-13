import { AppShell } from '@mantine/core';

// App Router
import { Session } from '@supabase/supabase-js';
import { createContext, useEffect, useState } from 'react';

import { supabase } from 'src/app/supabase/client';
import AppHeader from './nav/AppHeader/AppHeader';
import { AppNavbar } from './nav/AppNavbar/AppNavbar';
import Router from './Router';
import { Group } from './types/supabase-type-extensions';

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
      setGroupList(data);
    }
  };

  const [navOpen, setNavOpen] = useState(false);

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
    <GroupContext.Provider value={groups}>
      <SessionContext.Provider value={session}>
        <AppShell
          header={<AppHeader navOpen={navOpen} setNavOpen={setNavOpen} />}
          navbar={
            <AppNavbar
              getGroups={getGroups}
              navOpen={navOpen}
              setNavOpen={setNavOpen}
            />
          }
          styles={(theme) => ({
            main: {
              backgroundColor:
                theme.colorScheme === 'dark'
                  ? theme.colors.dark[8]
                  : theme.colors.gray[0],
            },
          })}
        >
          <Router getGroups={getGroups} />
        </AppShell>
      </SessionContext.Provider>
    </GroupContext.Provider>
  );
}

export default App;
