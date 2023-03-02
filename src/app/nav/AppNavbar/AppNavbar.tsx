// Hooks
import { NavLink, useLocation } from 'react-router-dom';
import { useContext } from 'react';
import { createStyles } from '@mantine/styles';

// Icons
import { FaDiceD20, FaPlus } from 'react-icons/fa';

// Components
import { Code, Group, Navbar, Text } from '@mantine/core';
import { DiscordButton } from 'src/app/auth/DiscordButton';
import { UserButton } from '../UserButton/UserButton';
import JoinBox from '../JoinBox/JoinBox';

// Supabase
import { GroupContext, SessionContext } from 'src/app/app';

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
      cursor: 'pointer',
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

export function AppNavbar({ getGroups }: { getGroups: () => Promise<void> }) {
  const session = useContext(SessionContext);
  const groups = useContext(GroupContext);

  const location = useLocation();

  const { classes, cx } = useStyles();

  const links = groups?.map((group) => (
    <NavLink
      className={cx(classes.link, {
        [classes.linkActive]: location.pathname.includes(`/group/${group.id}`),
      })}
      to={`/group/${group.id}`}
      key={group.id}
      onClick={getGroups}
    >
      <Group>
        <FaDiceD20 />
        {group.name}
      </Group>
    </NavLink>
  ));

  // Header with title and version
  const navbarHeader = (
    <Navbar.Section className={classes.header}>
      <Group position="apart">
        <Text size="xl" weight={500}>
          Trusty Tavern
        </Text>
        <Code sx={{ fontWeight: 700 }}>v0.0.1</Code>
      </Group>
    </Navbar.Section>
  );

  // Footer with user button or discord button
  const navbarFooter = session?.user ? (
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
  );

  // Links to groups and a shortcut to the contents page (subject to change)
  const navbarLinks = (
    <>
      <Navbar.Section grow>{links}</Navbar.Section>
      <Navbar.Section>
        <NavLink
          className={cx(classes.link, {
            [classes.linkActive]: location.pathname.includes(`/contents`),
          })}
          to="/contents"
          key="contents"
          onClick={getGroups}
        >
          <Group style={{ fontWeight: 700 }}>Content Preferences</Group>
        </NavLink>
      </Navbar.Section>
    </>
  );

  // Join box and create new group button
  const navbarInteractions = (
    <>
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
      <Navbar.Section mb={'md'}>
        <JoinBox getGroups={getGroups} />
      </Navbar.Section>
    </>
  );

  return (
    <Navbar width={{ sm: 300 }} p="md" pb="0">
      {navbarHeader}
      {navbarLinks}

      {navbarInteractions}
      {navbarFooter}
    </Navbar>
  );
}
