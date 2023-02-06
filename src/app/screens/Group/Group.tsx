import {
  ActionIcon,
  Avatar,
  Button,
  CheckIcon,
  Container,
  CopyButton,
  Divider,
  Group as MantineGroup,
  Overlay,
  Stack,
  Text,
  Title,
  Tooltip,
  UnstyledButton,
} from '@mantine/core';
import { RxCheck, RxClipboard } from 'react-icons/rx';
import { useHover } from '@mantine/hooks';
import { useContext, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { supabase } from 'src/app/supabase/client';
import { SessionContext } from 'src/app/app';
import { SiDiscord } from 'react-icons/si';

// Takes group from url params and fetches group data
function Group() {
  const session = useContext(SessionContext);
  const { invite_code } = useParams();
  const [group, setGroup] = useState<Group | null>(null);

  const fetchGroup = async () => {
    const { data, error } = await supabase
      .from('group')
      .select('*')
      .eq('invite_code', invite_code);
    if (error) {
      console.log(error);
    }
    if (data) {
      setGroup(data[0]);
    }
  };

  useEffect(() => {
    fetchGroup();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Stack>
      <MantineGroup position={'apart'}>
        <Title>{group?.name}</Title>
        <MantineGroup>
          <Stack spacing={0}>
            <Text style={{ fontWeight: 700 }}>Invite Code</Text>
            <Text inline italic align="center">
              {group?.invite_code}
            </Text>
          </Stack>
          <CopyButton value="Invite Code">
            {({ copied, copy }) => (
              // Provided by the clipboard hook
              <Tooltip
                label={copied ? 'Copied' : 'Copy'}
                withArrow
                position="right"
              >
                <ActionIcon color={copied ? 'teal' : 'gray'} onClick={copy}>
                  {copied ? <RxCheck size={16} /> : <RxClipboard size={16} />}
                </ActionIcon>
              </Tooltip>
            )}
          </CopyButton>
        </MantineGroup>
      </MantineGroup>
      <Divider />

      {session?.user ? (
        <UserPreview
          user={{
            id: session?.user.id,
            full_name: session?.user.user_metadata.full_name,
            name: session?.user.user_metadata.name,
            avatar_url: session?.user.user_metadata.avatar_url,
          }}
          key={session.user.id}
        />
      ) : null}
    </Stack>
  );
}

export default Group;

export const UserPreview = ({
  user,
}: {
  user: {
    id: string;
    full_name: string;
    name: string;
    avatar_url: string;
  };
}) => {
  const { hovered, ref } = useHover();
  return (
    <Stack>
      <MantineGroup position={'apart'}>
        <MantineGroup>
          <UnstyledButton
            onClick={() => {
              window.open(`https://discord.com/users/${user.name}`, '_blank');
            }}
          >
            <Avatar
              ref={ref}
              src={hovered ? undefined : user.avatar_url}
              alt={user.full_name}
              size="xl"
              radius="xl"

              // color={hovered ? 'teal' : 'gray'}
            >
              <SiDiscord style={{ width: '100%' }} color={'#5865F2'} />
            </Avatar>
          </UnstyledButton>

          <Stack spacing={0}>
            <Text style={{ fontWeight: 700 }}>{user.full_name}</Text>
            <Text inline italic align="center">
              {user.name}
            </Text>
          </Stack>
        </MantineGroup>
        <MantineGroup>
          <Text style={{ fontWeight: 700 }}>Survey Complete?</Text>
          <RxCheck size={30} />
        </MantineGroup>
      </MantineGroup>
      <Divider />
    </Stack>
  );
};
