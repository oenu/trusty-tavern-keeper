import { Group, Header } from '@mantine/core';
import { Session } from '@supabase/supabase-js';
import { DiscordButton } from '../auth/DiscordButton';

function NavHeader({ session }: { session: Session | null }) {
  return (
    <Header height={60} p="xs">
      <Group position="right">
        <DiscordButton
          session={session}
          path="profile"
          label
          callback={(response) => {
            console.log('RESPONSE FOLLOWS - nav');
            console.log(response.data);
          }}
        />
      </Group>
    </Header>
  );
}

export default NavHeader;
