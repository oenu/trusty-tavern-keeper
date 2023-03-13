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
import { GroupContext, SessionContext } from 'src/app/app';
import { RiChatSettingsFill } from 'react-icons/ri';
import { ThemeContext } from '@emotion/react';

// const useStyles = createStyles((theme, _params, getRef) => {
//   // const icon = getRef('icon');
//   return {
//     navbar: {
//       backgroundColor:
//         theme.colorScheme === 'dark' ? theme.colors.dark[6] : theme.white,
//       paddingBottom: 0,
//     },

//     link: {
//       cursor: 'pointer',
//       ...theme.fn.focusStyles(),
//       display: 'flex',
//       alignItems: 'center',
//       textDecoration: 'none',
//       fontSize: theme.fontSizes.sm,
//       color:
//         theme.colorScheme === 'dark'
//           ? theme.colors.dark[1]
//           : theme.colors.gray[7],
//       padding: `${theme.spacing.xs}px ${theme.spacing.sm}px`,
//       borderRadius: theme.radius.sm,
//       fontWeight: 500,

//       '&:hover': {
//         backgroundColor:
//           theme.colorScheme === 'dark'
//             ? theme.colors.dark[6]
//             : theme.colors.gray[0],
//         color: theme.colorScheme === 'dark' ? theme.white : theme.black,

//         [`& .${icon}`]: {
//           color: theme.colorScheme === 'dark' ? theme.white : theme.black,
//         },
//       },
//     },

//     linkIcon: {
//       ref: icon,
//       color:
//         theme.colorScheme === 'dark'
//           ? theme.colors.dark[2]
//           : theme.colors.gray[6],
//       marginRight: theme.spacing.sm,
//     },

//     linkActive: {
//       '&, &:hover': {
//         backgroundColor: theme.fn.variant({
//           variant: 'light',
//           color: theme.primaryColor,
//         }).background,
//         color: theme.fn.variant({ variant: 'light', color: theme.primaryColor })
//           .color,
//         [`& .${icon}`]: {
//           color: theme.fn.variant({
//             variant: 'light',
//             color: theme.primaryColor,
//           }).color,
//         },
//       },
//     },

//     footer: {
//       marginLeft: -theme.spacing.md,
//       marginRight: -theme.spacing.md,
//       borderTop: `1px solid ${
//         theme.colorScheme === 'dark'
//           ? theme.colors.dark[4]
//           : theme.colors.gray[3]
//       }`,
//     },
//   };
// });

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

  return (
    <Navbar
      sx={{
        backgroundColor:
          theme.colorScheme === 'dark' ? theme.colors.dark[6] : theme.white,
        paddingBottom: 0,
      }}
      width={{ sm: 300 }}
      p="md"
      hiddenBreakpoint="sm"
    >
      {/* Links to groups and a shortcut to the contents page */}
      <Navbar.Section grow component={ScrollArea}>
        <Title order={3} mb="xs">
          Groups
        </Title>
        {groups?.map((group) => (
          <Box
            component={NavLink}
            to={`/group/${group.id}`}
            key={group.id}
            onClick={() => {
              getGroups();
              setNavOpen(false);
            }}
            sx={{
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
              hover: {
                backgroundColor:
                  theme.colorScheme === 'dark'
                    ? theme.colors.dark[6]
                    : theme.colors.gray[0],
              },
            }}
          >
            <Group
              sx={
                location.pathname.includes(`/group/${group.id}`)
                  ? {
                      backgroundColor: theme.fn.variant({
                        variant: 'light',
                        color: theme.primaryColor,
                      }).background,
                      color: theme.fn.variant({
                        variant: 'light',
                        color: theme.primaryColor,
                      }).color,
                    }
                  : {}
              }
            >
              <Box
                sx={{
                  color:
                    theme.colorScheme === 'dark'
                      ? theme.colors.dark[2]
                      : theme.colors.gray[6],
                  marginRight: theme.spacing.sm,
                }}
                component={FaDiceD20}
              />
              {group.name}
            </Group>
          </Box>
        ))}
      </Navbar.Section>
      <Navbar.Section>
        <NavLink
          // className={cx(classes.link, {
          // [classes.linkActive]: location.pathname.includes(`/contents`),
          // })}
          to="/contents"
          key="contents"
          onClick={() => {
            getGroups();
            setNavOpen(false);
          }}
        >
          <Group style={{ fontWeight: 700 }}>
            <RiChatSettingsFill />
            Content Preferences
          </Group>
        </NavLink>
      </Navbar.Section>
      {/* Join box and create new group button */}
      <Navbar.Section mb={'md'}>
        <NavLink
          style={{ marginBottom: '1rem' }}
          // className={cx(classes.link, {
          // [classes.linkActive]: location.pathname.includes(`/create`),
          // })}
          onClick={() => setNavOpen(false)}
          to="/create"
        >
          <Group style={{ fontWeight: 700 }}>
            <FaPlus />
            Create New Group
          </Group>
        </NavLink>
      </Navbar.Section>
      <Navbar.Section mb={'md'}>
        <JoinBox getGroups={getGroups} />
      </Navbar.Section>
    </Navbar>
  );
}
