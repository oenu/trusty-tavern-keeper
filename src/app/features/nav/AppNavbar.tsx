import {
  Navbar,
  Group,
  Code,
  // ScrollArea,
  Avatar,
  UnstyledButton,
  Text,
} from '@mantine/core';
import { createStyles } from '@mantine/styles';
import { forwardRef, useEffect, useState } from 'react';
import { TbChevronRight } from 'react-icons/tb';
import { FaDiceD20 } from 'react-icons/fa';
import { Session } from '@supabase/supabase-js';
import { SiDiscord } from 'react-icons/si';
import { DiscordButton } from '../auth/DiscordButton';
import { NavLink } from 'react-router-dom';
import { supabase } from 'src/app/supabase/client';
const data = [
  { link: 'test', label: 'test', icon: TbChevronRight },
  { link: 'discord', label: 'discord', icon: SiDiscord },
];

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

export function AppNavbar({ session }: { session: Session | null }) {
  const { classes, cx } = useStyles();
  const [active, setActive] = useState('test');

  // HACK: This will be replaced with a proper type once the supabase client is updated
  type Group = {
    // id: 1
    id: number;
    // initial_intensity: "Adventure"
    initial_intensity: string;
    // invite_code: "e0e6db"
    invite_code: string;
    // name: "testGroupName"
    name: string;
    // owner: "90e4dee5-aa27-4e6f-bc24-f6d5b095198c"
    owner: string;
  };

  // Group list for sidebar
  const [groups, setGroups] = useState<Group[]>([]);

  // Get groups from supabase
  const getGroups = async (): Promise<Group[]> => {
    const { data, error } = await supabase.from('group').select('*');
    if (error) {
      console.log(error);
    }
    return data as Group[];
  };

  useEffect(() => {
    console.log('Getting groups');
    getGroups().then((data) => {
      setGroups(data);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const links = groups.map((group) => (
    <NavLink
      className={cx(classes.link, {
        [classes.linkActive]: group.invite_code === active,
      })}
      // className={classes.link}
      to={group.invite_code}
      key={group.invite_code}
      onClick={(event) => {
        setActive(group.invite_code);
      }}
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
      {session ? (
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

interface UserButtonProps extends React.ComponentPropsWithoutRef<'button'> {
  image: string;
  name: string;
  discriminator: string;
  icon?: React.ReactNode;
}
const UserButton = forwardRef<HTMLButtonElement, UserButtonProps>(
  ({ image, name, discriminator, icon, ...others }: UserButtonProps, ref) => (
    <UnstyledButton
      ref={ref}
      sx={(theme) => ({
        display: 'block',
        width: '100%',
        padding: theme.spacing.md,
        color:
          theme.colorScheme === 'dark' ? theme.colors.dark[0] : theme.black,

        '&:hover': {
          backgroundColor:
            theme.colorScheme === 'dark'
              ? theme.colors.dark[8]
              : theme.colors.gray[0],
        },
      })}
      {...others}
    >
      <Group>
        <Avatar src={image} radius="xl" />

        <div style={{ flex: 1 }}>
          <Text size="sm" weight={500}>
            {name}
          </Text>

          <Text color="dimmed" size="xs">
            {discriminator}
          </Text>
        </div>

        {icon || <TbChevronRight size={16} />}
      </Group>
    </UnstyledButton>
  )
);
