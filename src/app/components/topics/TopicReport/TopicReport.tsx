// Components
import { Card, Group, Paper, Stack, Text, Title } from '@mantine/core';

// Hooks
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

// Icons
import {
  RiGhost2Fill,
  RiParentFill,
  RiSkull2Fill,
  RiUserFill,
} from 'react-icons/ri';

// Supabase
import { supabase } from 'src/app/supabase/client';

// Types
import { Topic, TopicIntensity } from 'src/app/types/supabase-type-extensions';
/**
 * Dev Notes:
 * - Should be able to sort by intensity
 * - Should be able to filter by intensity
 * - Get the topics by searching for the group id where number of responses is greater than 3
 */

interface GroupTopicResponse {
  topic_id: Topic['id'];
  topic_name: Topic['name'];
  topic_description: Topic['description'];
  fantasy_count: number;
  adventure_count: number;
  struggle_count: number;
  tragedy_count: number;
  fantasy_example: Topic['fantasy_example'];
  adventure_example: Topic['adventure_example'];
  struggle_example: Topic['struggle_example'];
  tragedy_example: Topic['tragedy_example'];
}

function TopicReport() {
  const [groupTopicResponses, setGroupTopicResponses] = useState<
    GroupTopicResponse[]
  >([]);

  const { group_id } = useParams<{ group_id: string }>();

  const iconSize = '2rem';

  useEffect(() => {
    if (!group_id) {
      console.error('No group id provided, cannot fetch group topic responses');
      return;
    }
    const group_id_int = parseInt(group_id);
    if (isNaN(group_id_int)) {
      console.error(
        'Invalid group id provided, cannot fetch group topic responses'
      );
      return;
    }

    supabase
      .rpc('get_group_topic_responses', { req_group_id: group_id_int })
      .then((response) => {
        if (response.error) {
          console.error(response.error);
        }

        if (response.data) {
          console.log(response.data);
          setGroupTopicResponses(response.data);
        }
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const reportItem = ({
    groupTopicResponse,
    intensity,
  }: {
    groupTopicResponse: GroupTopicResponse;
    intensity: TopicIntensity;
  }) => {
    const { topic_id, topic_description, topic_name } = groupTopicResponse;

    const reportContent = {
      [TopicIntensity.Fantasy]: {
        icon: <RiParentFill size={iconSize} />,
        example: groupTopicResponse.fantasy_example,
      },
      [TopicIntensity.Adventure]: {
        icon: <RiUserFill size={iconSize} />,
        example: groupTopicResponse.adventure_example,
      },
      [TopicIntensity.Struggle]: {
        icon: <RiGhost2Fill size={iconSize} />,
        example: groupTopicResponse.struggle_example,
      },
      [TopicIntensity.Tragedy]: {
        icon: <RiSkull2Fill size={iconSize} />,
        example: groupTopicResponse.tragedy_example,
      },
    };

    return (
      <Card key={topic_id}>
        <Group noWrap>
          {reportContent[intensity].icon}
          <Group style={{ width: '50%' }}>
            <Stack justify={'center'} spacing="xs">
              <Title order={3}>{topic_name}</Title>
              <Text italic size={'lg'}>
                {intensity}
              </Text>
            </Stack>
          </Group>
          <Text italic>{reportContent[intensity].example} </Text>
        </Group>
      </Card>
    );
  };

  const intensityClassifier = (
    groupTopicResponses: GroupTopicResponse[]
  ): {
    groupTopicResponse: GroupTopicResponse;
    intensity: TopicIntensity;
  }[] => {
    const intensityArray = groupTopicResponses.map((groupTopicResponse) => {
      const { fantasy_count, adventure_count, struggle_count, tragedy_count } =
        groupTopicResponse;
      let intensity = 'Fantasy' as TopicIntensity;
      if (fantasy_count > 0) intensity = TopicIntensity['Fantasy'];
      else if (adventure_count > 0) intensity = TopicIntensity['Adventure'];
      else if (struggle_count > 0) intensity = TopicIntensity['Struggle'];
      else if (tragedy_count > 0) intensity = TopicIntensity['Tragedy'];
      return { groupTopicResponse, intensity };
    });
    return intensityArray;
  };

  const reports = intensityClassifier(groupTopicResponses).map((report) =>
    reportItem(report)
  );

  return (
    <>
      <Paper p="md">
        <Title order={3}>Topic Report</Title>
        <Text>
          This report is generated from each of the topic responses in the
          group. It will only be shown once 3 or more responses have been
          submitted for anonymity.
        </Text>
      </Paper>
      {reports}
    </>
  );
}

export default TopicReport;
