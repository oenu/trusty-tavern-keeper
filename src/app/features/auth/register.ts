import { Session } from '@supabase/supabase-js';
import ky from 'ky';
import { type APIUser } from 'discord-api-types/v10';

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

  // Test discord API to get current user info

  // console.debug('handleRegister: Testing discord API to get current user info');
  // const discordUser = (await ky('https://discord.com/api/users/@me', {
  //   headers: {
  //     Authorization: `Bearer ${token}`,
  //   },
  // }).json()) as APIUser;
  // console.debug(discordUser.avatar);

  // console.debug('handleRegister: discordUser', discordUser);
};
