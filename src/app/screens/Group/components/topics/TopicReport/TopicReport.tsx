// Components
import { Card, Group, Paper, Stack, Text, Title } from '@mantine/core';

// Hooks
import { useEffect, useState } from 'react';

// Supabase
import { supabase } from 'src/app/supabase/client';

// Types
import { IconContext } from 'react-icons/lib';
import { Topic, TopicIntensity } from 'src/app/types/supabase-type-extensions';

// Utils
import { topicIntensityIcons } from '../topicUtils';

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

function TopicReport({ group_id }: { group_id: number }) {
  const [groupTopicResponses, setGroupTopicResponses] = useState<
    GroupTopicResponse[]
  >([]);

  const iconSize = '2rem';

  useEffect(() => {
    if (!group_id) {
      console.error('No group id provided, cannot fetch group topic responses');
      return;
    }

    supabase
      .rpc('get_group_topic_report', { req_group_id: group_id })
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
    const { topic_id, topic_name } = groupTopicResponse;

    const reportExample = {
      [TopicIntensity.Fantasy]: groupTopicResponse.fantasy_example,
      [TopicIntensity.Adventure]: groupTopicResponse.adventure_example,
      [TopicIntensity.Struggle]: groupTopicResponse.struggle_example,
      [TopicIntensity.Tragedy]: groupTopicResponse.tragedy_example,
    };

    return (
      <Card key={topic_id}>
        <IconContext.Provider value={{ size: iconSize }}>
          {topicIntensityIcons[intensity]}
          <Group noWrap>
            <Group style={{ width: '50%' }}>
              <Stack justify={'center'} spacing="xs">
                <Title order={3}>{topic_name}</Title>
                <Text italic size={'lg'}>
                  {intensity}
                </Text>
              </Stack>
            </Group>
            <Text italic>{reportExample[intensity]} </Text>
          </Group>
        </IconContext.Provider>
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
