// Components
import {
  ActionIcon,
  Button,
  Container,
  CopyButton,
  Divider,
  Group as MantineGroup,
  Paper,
  SegmentedControl,
  Stack,
  Text,
  Title,
  Tooltip,
} from '@mantine/core';
import MemberPreview from './MemberPreview';

// Hooks
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

// Icons
import { RxCheck, RxClipboard } from 'react-icons/rx';

// Supabase
import { supabase } from 'src/app/supabase/client';

// Types
import {
  Group as GroupType,
  User,
} from 'src/app/types/supabase-type-extensions';
import TopicReport from '../../../components/topics/TopicReport/TopicReport';
import TopicList from '../../../components/topics/Topics/TopicList';

// Local Types
export type GroupMember = Pick<
  User,
  'full_name' | 'name' | 'profile_picture' | 'discord_id'
> & { is_owner: boolean };

// Takes group from url params and fetches group data
function Group({ getGroups }: { getGroups: () => Promise<void> }) {
  // Get group id from url params
  const { group_id } = useParams();

  // Set up state
  const [group, setGroup] = useState<GroupType | null>(null);
  const [members, setMembers] = useState<GroupMember[] | null>(null);
  const [groupError, setGroupError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  // Outlet State
  const [subRoute, setSubRoute] = useState<string>('topics');

  // Navigate Hook
  const navigate = useNavigate();

  const fetchMembers = async (): Promise<GroupMember[] | null> => {
    if (group_id === undefined) throw new Error('No group id provided');
    const { data, error } = await supabase.rpc('get_group_users', {
      req_id: parseInt(group_id),
    });
    if (data) return data;
    else throw new Error('Could not fetch members' + error?.message);
  };

  const fetchGroup = async () => {
    const { data, error } = await supabase
      .from('group')
      .select('*')
      .eq('id', group_id);
    if (error) {
      console.log('Could not fetch group:' + error.message);
      console.log(error);
      setGroupError('Could not fetch group');
    }
    if (data) {
      if (data[0] === undefined) {
        console.log('Group not found');
        setGroupError(
          'Group not found, have you joined this group? If not, please check the invite code and try again.'
        );
        setLoading(false);
        return;
      } else {
        setGroup(data[0]);
        try {
          const members = await fetchMembers();
          setMembers(members);
        } catch (error) {
          console.log(error);
          setGroupError('Could not fetch members');
        }
        setLoading(false);
      }
    }
  };

  useEffect(() => {
    fetchGroup();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [group_id]);

  if (loading) {
    return <Container size="sm">Loading...</Container>;
  } else if (groupError) {
    return (
      <Container size="sm">
        <Text>{groupError}</Text>
      </Container>
    );
  } else {
    return (
      <Stack>
        <Paper p="md">
          <Stack>
            <MantineGroup position={'apart'}>
              <Title>{group?.name}</Title>
              <MantineGroup>
                <Button
                  onClick={async () => {
                    if (group_id === undefined)
                      throw new Error('No group id provided');
                    const { data, error } = await supabase.rpc('leave_group', {
                      req_id: parseInt(group_id),
                    });
                    if (error) {
                      console.log(error);
                    }
                    if (data) {
                      console.log(data);
                      await getGroups();
                      // TODO: Add a toast to confirm leaving group
                      navigate('/groups');
                    }
                  }}
                >
                  Leave
                </Button>
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
                      <ActionIcon
                        color={copied ? 'teal' : 'gray'}
                        onClick={copy}
                      >
                        {copied ? (
                          <RxCheck size={16} />
                        ) : (
                          <RxClipboard size={16} />
                        )}
                      </ActionIcon>
                    </Tooltip>
                  )}
                </CopyButton>
              </MantineGroup>
            </MantineGroup>
            <Divider />

            {members
              ?.sort((a, b) => {
                // Sort Owner to top, then sort by full name
                if (a.is_owner && !b.is_owner) return -1;
                else if (!a.is_owner && b.is_owner) return 1;
                else return a.full_name.localeCompare(b.full_name);
              })
              .map((member) => (
                <MemberPreview {...member} key={member.name} />
              ))}
          </Stack>
        </Paper>
        <SegmentedControl
          value={subRoute}
          onChange={(value) => setSubRoute(value)}
          data={[
            {
              label: 'Survey',
              value: 'topics',
            },
            {
              label: 'Report',
              value: 'report',
            },
          ]}
        />

        {subRoute === 'topics' ? <TopicList /> : <TopicReport />}
      </Stack>
    );
  }
}

export default Group;
