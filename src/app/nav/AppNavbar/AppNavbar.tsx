// Hooks
import { useContext } from 'react';
import { NavLink, useLocation } from 'react-router-dom';

// Icons
import { FaDiceD20, FaPlus } from 'react-icons/fa';

// Components
import {
  Box,
  Group,
  Navbar,
  ScrollArea,
  Title,
  useMantineTheme,
} from '@mantine/core';
import JoinBox from '../JoinBox/JoinBox';

// Supabase
import { RiChatSettingsFill } from 'react-icons/ri';
import { GroupContext } from 'src/app/app';

export function AppNavbar({
  getGroups,
  setNavOpen,
}: {
  getGroups: () => Promise<void>;
  setNavOpen: (open: boolean) => void;
}) {
  const groups = useContext(GroupContext);

  const location = useLocation();

  const theme = useMantineTheme();

  const navLinkTheme = {
    width: '100%',
    cursor: 'pointer',
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
  };

  const navLinkHoverTheme = {
    '&:hover': {
      backgroundColor:
        theme.colorScheme === 'dark'
          ? theme.colors.dark[6]
          : theme.colors.gray[0],
      color: theme.colorScheme === 'dark' ? theme.white : theme.black,
    },
  };

  const navLinkIconTheme = {
    color:
      theme.colorScheme === 'dark'
        ? theme.colors.dark[2]
        : theme.colors.gray[6],
    marginRight: theme.spacing.sm,
  };

  const navLinkActiveTheme = {
    backgroundColor: theme.fn.variant({
      variant: 'light',
      color: theme.primaryColor,
    }).background,
    color: theme.fn.variant({
      variant: 'light',
      color: theme.primaryColor,
    }).color,
  };

  return (
    <Navbar width={{ sm: 300 }} p="md" hiddenBreakpoint="sm">
      {/* Links to groups and a shortcut to the contents page */}
      <Navbar.Section grow w="100%" component={ScrollArea}>
        <Title order={3} mb="xs">
          Groups
        </Title>
        {groups?.map((group) => (
          <Box
            p={'xs'}
            component={NavLink}
            to={`/group/${group.id}`}
            key={group.id}
            onClick={() => {
              getGroups();
              setNavOpen(false);
            }}
            sx={[
              navLinkTheme,
              navLinkHoverTheme,
              location.pathname.includes(`/group/${group.id}`)
                ? navLinkActiveTheme
                : {},
            ]}
          >
            <Group>
              <Box sx={navLinkIconTheme} component={FaDiceD20} />
              {group.name}
            </Group>
          </Box>
        ))}
      </Navbar.Section>
      <Navbar.Section>
        <Box
          p={'xs'}
          component={NavLink}
          to="/contents"
          key="contents"
          onClick={() => {
            getGroups();
            setNavOpen(false);
          }}
          sx={[
            navLinkTheme,
            navLinkHoverTheme,
            location.pathname.includes(`/contents`) ? navLinkActiveTheme : {},
          ]}
        >
          <Group>
            <Box sx={navLinkIconTheme} component={RiChatSettingsFill} />
            Content Preferences
          </Group>
        </Box>
      </Navbar.Section>

      {/* Join box and create new group button */}

      <Box
        p={'xs'}
        component={NavLink}
        to="/create"
        key="create"
        mb={'md'}
        onClick={() => {
          getGroups();
          setNavOpen(false);
        }}
        sx={[
          navLinkTheme,
          navLinkHoverTheme,
          location.pathname.includes(`/create`) ? navLinkActiveTheme : {},
        ]}
      >
        <Group>
          <Box sx={[navLinkIconTheme]} component={FaPlus} />
          Create New Group
        </Group>
      </Box>

      {/* </Navbar.Section> */}
      <Navbar.Section mb={'md'}>
        <JoinBox getGroups={getGroups} />
      </Navbar.Section>
    </Navbar>
  );
}
