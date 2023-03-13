import { Burger, Group, Header, Text } from '@mantine/core';
import { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { IsMobileContext, SessionContext } from 'src/app/app';
import { DiscordButton } from 'src/app/auth/DiscordButton/DiscordButton';
import UserButton from '../UserButton/UserButton';

function AppHeader({
  navOpen,
  setNavOpen,
}: {
  navOpen: boolean;
  setNavOpen: (open: boolean) => void;
}) {
  const isMobile = useContext(IsMobileContext);
  const navigate = useNavigate();
  const session = useContext(SessionContext);

  return (
    <Header height={70}>
      <Group position="apart" noWrap>
        <Group p={'md'}>
          <Burger
            hidden={!isMobile}
            opened={navOpen}
            onClick={() => setNavOpen(!navOpen)}
          />

          <Text
            style={{ cursor: 'pointer' }}
            onClick={() => {
              setNavOpen(false);
              navigate('/');
            }}
            size="xl"
            weight={500}
          >
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
              customOnClick={() => setNavOpen(!navOpen)}
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