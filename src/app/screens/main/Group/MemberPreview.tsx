// Components
import {
  Text,
  Stack,
  UnstyledButton,
  Avatar,
  Divider,
  Group,
} from '@mantine/core';

// Hooks
import { useHover } from '@mantine/hooks';

// Icons
import { RxCheck } from 'react-icons/rx';
import { SiDiscord } from 'react-icons/si';

// Types
import { GroupMember } from './Group';

export default function MemberPreview(member: GroupMember) {
  const { hovered, ref } = useHover();
  return (
    <Stack>
      <Group position={'apart'}>
        <Group>
          <UnstyledButton
            onClick={() => {
              window.open(
                `https://discord.com/users/${member.discord_id}`,
                '_blank'
              );
            }}
          >
            <Avatar
              ref={ref}
              src={hovered ? undefined : member.profile_picture}
              alt={member.full_name}
              size="xl"
              radius="xl"
              style={{
                // Box shadow if owner
                boxShadow: member.is_owner ? '0 0 5px 6px teal' : undefined,
              }}
            >
              <SiDiscord style={{ width: '100%' }} color={'#5865F2'} />
            </Avatar>
          </UnstyledButton>

          <Stack spacing={0}>
            <Text style={{ fontWeight: 700 }}>{member.full_name}</Text>
            <Text inline italic align="center">
              {member.name}
            </Text>
          </Stack>
        </Group>
        {member.is_owner && (
          <Text inline color="teal">
            Owner
          </Text>
        )}
        <Group>
          <Text style={{ fontWeight: 700 }}>Survey Complete?</Text>
          <RxCheck size={30} />
        </Group>
      </Group>
      <Divider />
    </Stack>
  );
}
