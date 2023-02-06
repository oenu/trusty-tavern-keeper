import { Avatar, Button, Group, Stack, Title } from '@mantine/core';
import { useContext } from 'react';
import { Link } from 'react-router-dom';
import { SessionContext } from 'src/app/app';
import { supabase } from 'src/app/supabase/client';

function Profile() {
  const session = useContext(SessionContext);

  return (
    <Stack mt={'xl'} align={'center'}>
      <Group>
        <Avatar src={session?.user?.user_metadata?.avatar_url} size="xl" />
        <Stack spacing={0}>
          <Title order={2} mb={0}>
            {session?.user?.user_metadata.full_name}
          </Title>
          <Title order={5} color="dimmed" italic>
            {session?.user?.email}
          </Title>
        </Stack>
      </Group>
      <Link
        to="/"
        style={{
          textDecoration: 'none',
        }}
      >
        <Button
          onClick={() => {
            supabase.auth.signOut();
          }}
        >
          Sign out
        </Button>
      </Link>
    </Stack>
  );
}

export default Profile;
