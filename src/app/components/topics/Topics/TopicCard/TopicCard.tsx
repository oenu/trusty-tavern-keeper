import {
  Text,
  Card,
  Stack,
  Group,
  Title,
  Loader,
  Paper,
  Skeleton,
  SegmentedControl,
} from '@mantine/core';
import React from 'react';
import { Topic, TopicIntensity } from 'src/app/types/supabase-type-extensions';

function TopicCard({
  topic,
  isPending,
  responsesLoading,
  topicIntensity = TopicIntensity.Fantasy, // Default to fantasy
  handleTopicResponse,
}: {
  topic: Topic;
  isPending: boolean;
  responsesLoading: boolean;
  topicIntensity: TopicIntensity;
  handleTopicResponse: (
    topicId: Topic['id'],
    intensity: TopicIntensity
  ) => void;
}) {
  const topicText = {
    [TopicIntensity.Fantasy]: topic.fantasy_example,
    [TopicIntensity.Adventure]: topic.adventure_example,
    [TopicIntensity.Struggle]: topic.struggle_example,
    [TopicIntensity.Tragedy]: topic.tragedy_example,
  };
  console.log({ topicText });

  return (
    <Card key={topic.id}>
      <Stack justify={'space-between'} style={{ height: '100%' }}>
        <Stack>
          <Group position="apart" noWrap>
            <Title order={3}>
              {topic.name}
              {isPending && <Loader size={20} color="blue" />}
            </Title>
          </Group>
          <Text>{topic.description}</Text>
        </Stack>
        <Stack align={'stretch'} justify={'space-between'}>
          <Paper py={'md'}>
            <Text fz="xl" ta={'center'} italic>
              {topicText[topicIntensity]}
            </Text>
          </Paper>
          <Skeleton radius="sm" visible={responsesLoading}>
            <SegmentedControl
              fullWidth
              transitionDuration={0}
              disabled={isPending || responsesLoading}
              value={topicIntensity}
              onChange={(value) => {
                console.log(
                  `Changing topic response for ${topic.name} to ${value}`
                );
                handleTopicResponse(topic.id, value as TopicIntensity);
              }}
              data={Object.keys(TopicIntensity).map((key) => ({
                label: key,
                value: TopicIntensity[key as keyof typeof TopicIntensity],
              }))}
            />
          </Skeleton>
        </Stack>
      </Stack>
    </Card>
  );
}

export default TopicCard;
