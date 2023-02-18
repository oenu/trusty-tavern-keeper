import {
  Text,
  Card,
  Group,
  Loader,
  Paper,
  SegmentedControl,
  Skeleton,
  Stack,
  Title,
  SimpleGrid,
} from '@mantine/core';
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { supabase } from 'src/app/supabase/client';
import {
  Topic,
  TopicIntensity,
  TopicResponse,
} from 'src/app/types/supabase-type-extensions';

function Topics() {
  // Get group id from url params
  const { group_id } = useParams();

  // Data states
  const [topics, setTopics] = useState<Topic[]>([]);
  const [topicResponses, setTopicResponses] = useState<TopicResponse[]>([]);

  // Loading states
  const [topicResponsesLoading, setTopicResponsesLoading] =
    useState<boolean>(true);
  const [topicsLoading, setTopicsLoading] = useState<boolean>(true);
  const [pendingTopicResponses, setPendingTopicResponses] = useState<number[]>(
    []
  );

  // Error states
  const [topicResponsesError, setTopicResponsesError] = useState<string | null>(
    null
  );
  const [topicsError, setTopicsError] = useState<string | null>(null);

  /**
   * Handle Topic Response
   * Handles the response to a topic
   * @param {number} topic_id - The id of the topic
   * @param {number} intensity - The intensity of the response
   * @returns {Promise<void>}
   * @throws {Error} If there is an error upserting the topic response
   * @async
   */

  const handleTopicResponse = async (
    topic_id: number,
    intensity: TopicIntensity
  ): Promise<void> => {
    // Verify that the group id is defined
    if (group_id === undefined) {
      console.error('No group id provided');
      return;
    }

    // If the topic response is already pending, don't do anything
    if (pendingTopicResponses.includes(topic_id)) return;
    const user_id = (await supabase.auth.getUser()).data.user?.id;
    if (!user_id) {
      console.error('No user id, this should not happen');
      return;
    }

    // Add the topic id to the pending topic responses
    setPendingTopicResponses((prevPendingTopicResponses) => [
      ...prevPendingTopicResponses,
      topic_id,
    ]);

    console.debug(
      `Updating topic ${topic_id} with intensity ${intensity} in group ${group_id}`
    );

    // Upsert the topic response
    supabase
      .from('topic_response')
      .upsert({
        group_id: parseInt(group_id),
        user_id,
        topic_id,
        intensity,
      })
      .select('*')
      .then(({ data, error }) => {
        if (data) {
          console.debug('Upserted topic response follows:');
          console.debug(data);
          setTopicResponses((prevTopicResponses) => {
            const newResponses = [...prevTopicResponses];
            const index = newResponses.findIndex(
              (topicResponse) =>
                topicResponse.topic_id === topic_id &&
                topicResponse.user_id === user_id
            );

            // If the topic response doesn't exist, add it
            if (index === -1) newResponses.push(data[0]);
            // Otherwise, replace it
            else newResponses[index] = data[0];
            return newResponses;
          });
        } else if (error) {
          console.error(error);
        } else {
          console.error('No data or error returned from topic response upsert');
        }

        // Remove the topic id from the pending topic responses
        setPendingTopicResponses((prevPendingTopicResponses) =>
          prevPendingTopicResponses.filter((id) => id !== topic_id)
        );
      });
  };

  // Fetch topics and topic responses
  useEffect(() => {
    // Verify that the group id is defined
    if (group_id === undefined) {
      console.error('No group id provided');
      setTopicsError('No group id provided');
      return;
    }

    fetchTopics(parseInt(group_id))
      .then((topics: Topic[]) => {
        setTopics(topics);
        setTopicsLoading(false);
        fetchTopicResponses(parseInt(group_id))
          .then((topicResponses: TopicResponse[]) => {
            setTopicResponses(topicResponses);
            setTopicResponsesLoading(false);
          })
          .catch((error) => {
            setTopicResponsesError(error.message);
          });
      })
      .catch((error) => {
        setTopicsError(error.message);
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  //   const contentCards = contents.map((content) => (
  //   <Card key={content.id}>
  //     <Stack justify={'space-between'} style={{ height: '100%' }}>
  //       <Stack>
  //         <Group position="apart" noWrap>
  //           <Title order={3}>{content.name}</Title>
  //           {pendingContentResponses.includes(content.id) && (
  //             <Loader size={20} color="blue" />
  //           )}
  //         </Group>
  //         <Text>{content.description}</Text>
  //       </Stack>
  //       <Stack align={'stretch'} justify={'space-between'}>
  //         <Skeleton radius="sm" visible={contentResponsesLoading}>
  //           <SegmentedControl
  //             fullWidth
  //             transitionDuration={0}
  //             disabled={
  //               contentResponsesLoading ||
  //               pendingContentResponses.includes(content.id)
  //             }
  //             value={
  //               contentResponses.find(
  //                 (contentResponse) => contentResponse.content_id === content.id
  //               )?.intensity
  //             }
  //             onChange={(value) => {
  //               console.log(
  //                 `Changing content response for ${content.name} to ${value}`
  //               );
  //               handleContentResponse(content.id, value as ContentIntensity);
  //             }}
  //             data={Object.keys(ContentIntensity).map((key) => ({
  //               label: key,
  //               value: ContentIntensity[key as keyof typeof ContentIntensity],
  //             }))}
  //           />
  //         </Skeleton>
  //       </Stack>
  //     </Stack>
  //   </Card>
  // ));
  // Topic Cards
  const topicCards = topics.map((topic) => {
    const topicValue = topicResponses.find(
      (topicResponse) => topicResponse.topic_id === topic.id
    )?.intensity;

    let topicText = 'Unknown';

    switch (topicValue) {
      case TopicIntensity.Fantasy:
        topicText = topic.fantasy_example;
        break;
      case TopicIntensity.Adventure:
        topicText = topic.adventure_example;
        break;
      case TopicIntensity.Struggle:
        topicText = topic.struggle_example;
        break;
      case TopicIntensity.Tragedy:
        topicText = topic.tragedy_example;
        break;
      default:
        topicText = topic.fantasy_example;
        break;
    }

    return (
      <Card key={topic.id}>
        <Stack justify={'space-between'} style={{ height: '100%' }}>
          <Stack>
            <Group position="apart" noWrap>
              <Title order={3}>
                {topic.name}
                {pendingTopicResponses.includes(topic.id) && (
                  <Loader size={20} color="blue" />
                )}
              </Title>
            </Group>
            <Text>{topic.description}</Text>
          </Stack>
          <Stack align={'stretch'} justify={'space-between'}>
            <Paper py={'md'}>
              <Text fz="xl" ta={'center'} italic>
                {topicText}
              </Text>
            </Paper>
            <Skeleton radius="sm" visible={topicResponsesLoading}>
              <SegmentedControl
                fullWidth
                transitionDuration={0}
                disabled={
                  topicResponsesLoading ||
                  pendingTopicResponses.includes(topic.id)
                }
                value={topicValue}
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
  });

  return (
    <Paper p="md">
      <Stack>
        <Title order={2}>Topic Questions</Title>
        {topicsLoading ? (
          <Loader size={20} color="blue" />
        ) : topicsError ? (
          <Text>{topicsError}</Text>
        ) : (
          <Stack>{topicCards}</Stack>
        )}
      </Stack>
    </Paper>
  );
}

export default Topics;

/**
 * Fetch Topics
 * Fetches all topics from the database
 * @returns {Promise<Topic[]>}
 * @throws {Error} If there is an error fetching topics
 * @async
 */
const fetchTopics = async (group_id: number): Promise<Topic[]> => {
  const { data, error } = await supabase.from('topic').select('*');
  if (error) throw new Error('Could not fetch topics: ' + error.message);
  else if (data) return data;
  else throw new Error('Could not fetch topics');
};

/**
 * Fetch Topic Responses
 * Fetches all topic responses from the database for a particular group
 * @param {number} group_id - The group id to fetch topic responses for
 * @returns {Promise<TopicResponse[]>}
 * @throws {Error} If there is an error fetching topic responses
 * @async
 */

const fetchTopicResponses = async (
  group_id: number
): Promise<TopicResponse[]> => {
  const { data, error } = await supabase
    .from('topic_response')
    .select('*')
    .eq('group_id', group_id);
  if (error)
    throw new Error('Could not fetch topic responses: ' + error.message);
  else if (data) return data;
  else throw new Error('Could not fetch topic responses');
};
