// Topic report
// Generated from each of the topic responses in the group,
// Will only be shown once 3 or more responses have been submitted (anonymity)

import {
  Box,
  Card,
  Container,
  Group,
  Paper,
  Stack,
  Text,
  Title,
} from '@mantine/core';
import { useEffect, useState } from 'react';
import {
  RiGhost2Fill,
  RiParentFill,
  RiSkull2Fill,
  RiUserFill,
} from 'react-icons/ri';
import { supabase } from 'src/app/supabase/client';
import { Topic } from 'src/app/types/supabase-type-extensions';

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

  const iconSize = '2rem';

  useEffect(() => {
    supabase
      .rpc('get_group_topic_responses', { req_group_id: 1 }) // TODO: Replace with group id
      .then((response) => {
        if (response.error) {
          console.error(response.error);
        }

        if (response.data) {
          console.log(response.data);
          setGroupTopicResponses(response.data);
        }
      });
  }, []);

  const reportItem = ({
    groupTopicResponse,
    intensity,
  }: {
    groupTopicResponse: GroupTopicResponse;
    intensity: 'Fantasy' | 'Adventure' | 'Struggle' | 'Tragedy';
  }) => {
    const { topic_id, topic_description, topic_name } = groupTopicResponse;
    let selectedExample = ''; // Example of the topic
    let selectedIcon = <RiParentFill size={iconSize} />; // Icon to show the intensity
    switch (intensity) {
      case 'Fantasy':
        selectedIcon = <RiParentFill size={iconSize} />;
        selectedExample = groupTopicResponse.fantasy_example;
        break;
      case 'Adventure':
        selectedIcon = <RiUserFill size={iconSize} />;
        selectedExample = groupTopicResponse.adventure_example;
        break;
      case 'Struggle':
        selectedIcon = <RiGhost2Fill size={iconSize} />;
        selectedExample = groupTopicResponse.struggle_example;
        break;
      case 'Tragedy':
        selectedIcon = <RiSkull2Fill size={iconSize} />;
        selectedExample = groupTopicResponse.tragedy_example;
        break;
    }

    return (
      <Card key={topic_id}>
        <Group noWrap>
          {selectedIcon}
          <Group style={{ width: '50%' }}>
            <Stack justify={'center'} spacing="xs">
              <Title order={3}>{topic_name}</Title>
              <Text italic size={'lg'}>
                {intensity}
              </Text>
            </Stack>
          </Group>
          <Text italic>{selectedExample} </Text>
        </Group>
      </Card>
    );
  };

  const intensityClassifier = (
    groupTopicResponses: GroupTopicResponse[]
  ): {
    groupTopicResponse: GroupTopicResponse;
    intensity: 'Fantasy' | 'Adventure' | 'Struggle' | 'Tragedy';
  }[] => {
    const intensityArray = groupTopicResponses.map((groupTopicResponse) => {
      const { fantasy_count, adventure_count, struggle_count, tragedy_count } =
        groupTopicResponse;
      let intensity = 'Fantasy' as
        | 'Fantasy'
        | 'Adventure'
        | 'Struggle'
        | 'Tragedy';
      if (fantasy_count > 0) intensity = 'Fantasy';
      else if (adventure_count > 0) intensity = 'Adventure';
      else if (struggle_count > 0) intensity = 'Struggle';
      else if (tragedy_count > 0) intensity = 'Tragedy';
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
