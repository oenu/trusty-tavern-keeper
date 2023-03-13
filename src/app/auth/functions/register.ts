import { Session } from '@supabase/supabase-js';
// import ky from 'ky';
// import { type APIUser } from 'discord-api-types/v10';
import { supabase } from 'src/app/supabase/client';

export const handleRegister = async ({
  session,
}: {
  session: Session | null;
}) => {
  console.log('handleRegister: ', session);

  if (!session) {
    console.debug('handleRegister: No session found');
    return;
  }

  // Test
  // Add name to supabase

  const profiles = await supabase.from('profiles').select();

  console.log('handleRegister: profiles', profiles);

  const nameResponse = await supabase
    .from('public.profiles')
    .update([{ name: 'testName' }])
    .select();

  if (nameResponse.error) {
    console.error('handleRegister: Error creating content', nameResponse.error);
    return;
  }

  console.log('handleRegister: profile updated', nameResponse.data);
};
