// Components
import {
  ActionIcon,
  Alert,
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
import TopicReport from 'src/app/components/topics/TopicReport/TopicReport';
import TopicList from 'src/app/components/topics/Topics/TopicList/TopicList';
import MemberPreview from '../../components/group/MemberPreview';

// Hooks
import { createContext, useEffect, useState } from 'react';
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
import ContentReport from 'src/app/components/contents/ContentReport/ContentReport';

// Local Types
export type GroupMember = Pick<
  User,
  'full_name' | 'name' | 'profile_picture' | 'discord_id'
> & { is_owner: boolean; topics_submitted: boolean };

export const GroupContext = createContext({
  group: null as GroupType | null,
  members: null as GroupMember[] | null,
  // user: null as User | null,
  fetchMembers: null as (() => Promise<void>) | null,
  fetchGroup: null as (() => Promise<void>) | null,
});

// Takes group from url params and fetches group data
function Group({ getGroups }: { getGroups: () => Promise<void> }) {
  const requiredMembers = 2;

  // Get group id from url params
  const { group_id } = useParams();
  const group_id_int = parseInt(group_id as string) || 0;

  // Data States
  const [group, setGroup] = useState<GroupType | null>(null);
  const [members, setMembers] = useState<GroupMember[] | null>(null);
  // const [user, setUser] = useState<User | null>(null);
  const [enoughReports, setEnoughReports] = useState<boolean>(false);

  // Logic States
  const [loading, setLoading] = useState<boolean>(true);
  const [groupError, setGroupError] = useState<string | null>(null);

  // Outlet State
  const [subRoute, setSubRoute] = useState<string>('');

  // Navigate Hook
  const navigate = useNavigate();

  // ====================== FUNCTIONS ======================

  const fetchMembers = async () => {
    if (group_id === undefined) throw new Error('No group id provided');
    const { data, error } = await supabase.rpc('get_group_members', {
      req_id: parseInt(group_id),
    });
    console.log(data);
    if (data) {
      setMembers(data);

      // Check if there are enough reports
      const enoughReports =
        data.filter((member) => member.topics_submitted).length >=
        requiredMembers;
      setEnoughReports(enoughReports);
    } else throw new Error('Could not fetch members' + error?.message);
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
          await fetchMembers();
        } catch (error) {
          console.log(error);
          setGroupError('Could not fetch members');
        }
        setLoading(false);
      }
    }
  };

  // ====================== EFFECTS ======================

  useEffect(() => {
    setSubRoute('survey');
    fetchGroup();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [group_id]);

  // ====================== RENDER ======================

  // Group page header with group name, leave button, and invite code
  const groupInfo = (
    <MantineGroup position={'apart'}>
      <Title>{group?.name}</Title>
      <MantineGroup>
        <Button
          onClick={async () => {
            if (group_id === undefined) throw new Error('No group id provided');
            await supabase
              .rpc('leave_group', {
                req_id: parseInt(group_id),
              })
              .then((res) => {
                console.log(res);
                getGroups();
                navigate('/groups');
              });
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
              <ActionIcon color={copied ? 'teal' : 'gray'} onClick={copy}>
                {copied ? <RxCheck size={16} /> : <RxClipboard size={16} />}
              </ActionIcon>
            </Tooltip>
          )}
        </CopyButton>
      </MantineGroup>
    </MantineGroup>
  );

  // List of members sorted by owner status and full name
  const memberList = members
    ?.sort((a, b) => {
      // Sort Owner to top, then sort by full name
      if (a.is_owner && !b.is_owner) return -1;
      else if (!a.is_owner && b.is_owner) return 1;
      else return a.full_name.localeCompare(b.full_name);
    })
    .map((member) => <MemberPreview {...member} key={member.name} />);

  // Segmented control for switching between survey and report pages
  const subPageControl = (
    <Paper style={{ width: '100%' }} p="xs">
      {members &&
      members?.filter((member) => member.topics_submitted).length <
        requiredMembers ? (
        <Alert color="red" title="Not enough members have submitted a survey">
          You must have at least {requiredMembers} members submit a survey
          before you can view the report.
        </Alert>
      ) : null}

      <SegmentedControl
        style={{ width: '100%' }}
        value={subRoute}
        onChange={async (value) => {
          if (!members) throw new Error('No members found');
          // If less than 3 members have submitted a survey, do not allow user to view report
          if (value !== 'report') {
            setSubRoute(value);
            return;
          } else {
            if (enoughReports) {
              await fetchMembers();
              if (enoughReports) setSubRoute(value);
              else console.log('Not enough reports'); //TODO show alert
            } else setSubRoute(value);
          }
        }}
        data={[
          {
            label: 'Roleplay Survey',
            value: 'survey',
          },
          {
            label: 'Roleplay Report',
            value: 'report',
            disabled: !enoughReports,
          },
          {
            label: 'Content Report',
            value: 'content',
          },
        ]}
      />
    </Paper>
  );

  // If loading, show loading message else show group info, member list, and sub
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
            {groupInfo}
            <Divider />
            {memberList}
          </Stack>
        </Paper>
        {subPageControl}

        <GroupContext.Provider
          value={{ group, members, fetchMembers, fetchGroup }}
        >
          {
            {
              survey: <TopicList group_id={group_id_int} />,
              report: <TopicReport group_id={group_id_int} />,
              content: <ContentReport group_id={group_id_int} />,
            }[subRoute]
          }
        </GroupContext.Provider>
      </Stack>
    );
  }
}

export default Group;
