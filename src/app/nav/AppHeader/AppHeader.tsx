import { Burger, Group, Header, Text } from '@mantine/core';
import { useContext } from 'react';
import { SessionContext } from 'src/app/app';
import { DiscordButton } from 'src/app/auth/DiscordButton/DiscordButton';
import UserButton from '../UserButton/UserButton';

function AppHeader({
  navOpen,
  setNavOpen,
}: {
  navOpen: boolean;
  setNavOpen: (open: boolean) => void;
}) {
  const session = useContext(SessionContext);
  return (
    <Header height={'70'}>
      <Group position="apart" noWrap>
        <Group p={'md'}>
          <Burger opened={navOpen} onClick={() => setNavOpen(!navOpen)} />
          <Text size="xl" weight={500}>
            Trusty Tavern Keeper
          </Text>
        </Group>
        <Group noWrap mr={'md'}>
          {session?.user ? (
            <UserButton
              image={session?.user.user_metadata.avatar_url}
              name={session?.user.user_metadata.full_name}
              discriminator={session?.user?.identities?.[0]?.identity_data.name}
              short={window.innerWidth < 640}
            />
          ) : (
            <DiscordButton
              session={session}
              path={'/dashboard'}
              callback={(response) => {
                console.log(response);
              }}
              label={window.innerWidth > 640}
              // If we are sm then use short version of button (using mantine)
            />
          )}
        </Group>
      </Group>
    </Header>
  );
}

export default AppHeader;
