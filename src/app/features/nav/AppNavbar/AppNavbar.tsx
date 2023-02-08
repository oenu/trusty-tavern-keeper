import {
  Navbar,
  Group,
  Code,
  // ScrollArea,
  Text,
} from '@mantine/core';
import { useContext, useEffect, useState } from 'react';
import { createStyles } from '@mantine/styles';
import { FaDiceD20, FaPlus } from 'react-icons/fa';
import { NavLink, useLocation } from 'react-router-dom';

// Components
import { UserButton } from '../UserButton/UserButton';
import { DiscordButton } from '../../auth/DiscordButton';

// Supabase
import { supabase } from 'src/app/supabase/client';
import { SessionContext } from 'src/app/app';
import JoinBox from '../JoinBox/JoinBox';

const useStyles = createStyles((theme, _params, getRef) => {
  const icon = getRef('icon');
  return {
    navbar: {
      backgroundColor:
        theme.colorScheme === 'dark' ? theme.colors.dark[6] : theme.white,
      paddingBottom: 0,
    },

    header: {
      paddingBottom: theme.spacing.md,
      marginBottom: theme.spacing.md * 1.5,
      borderBottom: `1px solid ${
        theme.colorScheme === 'dark'
          ? theme.colors.dark[4]
          : theme.colors.gray[2]
      }`,
    },

    link: {
      ...theme.fn.focusStyles(),
      display: 'flex',
      alignItems: 'center',
      textDecoration: 'none',
      fontSize: theme.fontSizes.sm,
      color:
        theme.colorScheme === 'dark'
          ? theme.colors.dark[1]
          : theme.colors.gray[7],
      padding: `${theme.spacing.xs}px ${theme.spacing.sm}px`,
      borderRadius: theme.radius.sm,
      fontWeight: 500,

      '&:hover': {
        backgroundColor:
          theme.colorScheme === 'dark'
            ? theme.colors.dark[6]
            : theme.colors.gray[0],
        color: theme.colorScheme === 'dark' ? theme.white : theme.black,

        [`& .${icon}`]: {
          color: theme.colorScheme === 'dark' ? theme.white : theme.black,
        },
      },
    },

    linkIcon: {
      ref: icon,
      color:
        theme.colorScheme === 'dark'
          ? theme.colors.dark[2]
          : theme.colors.gray[6],
      marginRight: theme.spacing.sm,
    },

    linkActive: {
      '&, &:hover': {
        backgroundColor: theme.fn.variant({
          variant: 'light',
          color: theme.primaryColor,
        }).background,
        color: theme.fn.variant({ variant: 'light', color: theme.primaryColor })
          .color,
        [`& .${icon}`]: {
          color: theme.fn.variant({
            variant: 'light',
            color: theme.primaryColor,
          }).color,
        },
      },
    },

    footer: {
      marginLeft: -theme.spacing.md,
      marginRight: -theme.spacing.md,
      borderTop: `1px solid ${
        theme.colorScheme === 'dark'
          ? theme.colors.dark[4]
          : theme.colors.gray[3]
      }`,
    },
  };
});

export function AppNavbar() {
  const session = useContext(SessionContext);
  const location = useLocation();

  const { classes, cx } = useStyles();

  // Group list for sidebar
  const [groups, setGroups] = useState<Group[]>([]);

  // Get groups from supabase
  const getGroups = async () => {
    const { data, error } = await supabase.from('group').select('*');
    if (error) {
      console.log(error);
    } else {
      setGroups(data);
    }
  };

  useEffect(() => {
    // Get session
    getGroups();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const links = groups.map((group) => (
    <NavLink
      className={cx(classes.link, {
        [classes.linkActive]: location.pathname.includes(
          `/group/${group.invite_code}`
        ),
      })}
      // className={classes.link}
      to={`/group/${group.invite_code}`}
      key={group.invite_code}
    >
      <Group>
        <FaDiceD20 />
        {group.name}
      </Group>
    </NavLink>
  ));

  return (
    <Navbar width={{ sm: 300 }} p="md" pb="0">
      <Navbar.Section className={classes.header}>
        <Group position="apart">
          <Text size="xl" weight={500}>
            Trusty Tavern
          </Text>
          <Code sx={{ fontWeight: 700 }}>v0.0.1</Code>
        </Group>
      </Navbar.Section>

      <Navbar.Section grow>{links}</Navbar.Section>
      <Navbar.Section mb={'md'}>
        <JoinBox />
      </Navbar.Section>
      <NavLink
        style={{ marginBottom: '1rem' }}
        className={cx(classes.link, {
          [classes.linkActive]: location.pathname.includes(`/create`),
        })}
        to="/create"
      >
        <Group style={{ fontWeight: 700 }}>
          <FaPlus />
          Create New Group
        </Group>
      </NavLink>
      {/* Create new Group */}
      {/* <Navbar.Section></Navbar.Section> */}
      {session?.user ? (
        <Navbar.Section className={classes.footer}>
          <UserButton
            image={session?.user.user_metadata.avatar_url}
            name={session?.user.user_metadata.full_name}
            discriminator={session?.user?.identities?.[0]?.identity_data.name}
          />
        </Navbar.Section>
      ) : (
        <DiscordButton
          session={session}
          path={'/dashboard'}
          callback={(response) => {
            console.log(response);
          }}
          label
        />
      )}
    </Navbar>
  );
}
