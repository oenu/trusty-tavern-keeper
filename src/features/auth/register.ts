import { Session } from '@supabase/supabase-js';

export const handleRegister = async ({
  session,
}: {
  session: Session | null;
}) => {
  if (!session) {
    console.debug('handleRegister: No session found');
    return;
  }

  const token = session.provider_token;

  if (!token) {
    console.debug('handleRegister: No token found');
    throw new Error('No token found');
  }
};
