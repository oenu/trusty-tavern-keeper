import {
  Button,
  Group,
  Loader,
  Paper,
  Stack,
  Text,
  Title,
} from '@mantine/core';
import { useContext, useEffect, useState } from 'react';
import { GroupContext } from 'src/app/screens/Group/Group';
import { supabase } from 'src/app/supabase/client';
import {
  Topic,
  TopicIntensity,
  TopicResponse,
} from 'src/app/types/supabase-type-extensions';
import TopicCard from '../TopicCard/TopicCard';

function TopicList({
  group_id,
  max_intensity,
}: {
  group_id: number;
  max_intensity: TopicIntensity;
}) {
  const { fetchMembers } = useContext(GroupContext);

  // Topics
  const [topics, setTopics] = useState<Topic[]>([]);
  const [topicsLoading, setTopicsLoading] = useState<boolean>(true);
  const [topicsError, setTopicsError] = useState<string | null>(null);

  // Topic Responses
  const [topicResponses, setTopicResponses] = useState<TopicResponse[]>([]);
  const [topicResponsesLoading, setTopicResponsesLoading] =
    useState<boolean>(true);
  const [pendingTopicResponses, setPendingTopicResponses] = useState<number[]>(
    []
  );

  const [hasSubmittedTopics, setHasSubmittedTopics] = useState<boolean>(false);

  // ====================== FUNCTIONS ======================

  /**
   * Get user and check if they have submitted topics
   * @returns {Promise<void>}
   */

  const fetchUser = async (): Promise<void> => {
    const user = (await supabase.auth.getUser())?.data;
    if (!user) return;
    const { data, error } = await supabase
      .from('user_group')
      .select('topics_submitted')
      .eq('user_id', user.user?.id)
      .eq('group_id', group_id);
    error && console.error(error);
    data && data[0] && data[0].topics_submitted
      ? setHasSubmittedTopics(true)
      : setHasSubmittedTopics(false);
  };

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
        group_id,
        user_id,
        topic_id,
        intensity,
      })
      .select('*')
      .then(({ data, error }) => {
        if (data) {
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

  // ====================== EFFECTS ======================

  // Fetch topics and topic responses
  useEffect(() => {
    // Verify that the group id is defined
    if (group_id === undefined) {
      console.error('No group id provided');
      setTopicsError('No group id provided');
      return;
    }

    fetchUser();

    // Fetch topics and topic responses
    fetchTopics(group_id)
      .then((topics: Topic[]) => {
        setTopics(topics);
        setTopicsLoading(false);
        fetchTopicResponses(group_id)
          .then((topicResponses: TopicResponse[]) => {
            setTopicResponses(topicResponses);
            setTopicResponsesLoading(false);
          })
          .catch((error) => {
            console.error(error);
            // setTopicResponsesError(error.message);
          });
      })
      .catch((error) => {
        setTopicsError(error.message);
      });

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [group_id]);

  // ====================== RENDER ======================

  // Topic Cards
  const topicCards = topics.map((topic) => {
    const isPending = pendingTopicResponses.includes(topic.id);
    const topicValue = topicResponses.find(
      (topicResponse) => topicResponse.topic_id === topic.id
    )?.intensity;

    // Convert topic intensity to enum
    const topicIntensity =
      TopicIntensity[topicValue as keyof typeof TopicIntensity];

    return (
      <TopicCard
        key={topic.id}
        topic={topic}
        topicIntensity={topicIntensity}
        isPending={isPending}
        responsesLoading={topicResponsesLoading}
        maxIntensity={max_intensity}
        handleTopicResponse={handleTopicResponse}
      />
    );
  });

  return (
    <Paper p="md">
      <Stack>
        <Group position="apart">
          <Stack>
            <Title order={2}>Topic Questions</Title>
            <Text>Group Maximum Intensity: {max_intensity}</Text>
          </Stack>
          <Button
            color={hasSubmittedTopics ? 'red' : 'blue'}
            onClick={async () => {
              // Verify that the group id is defined
              if (group_id === undefined) {
                console.error('No group id provided');
                return;
              }

              // Check if the user is logged in
              const user_id = (await supabase.auth.getUser()).data.user?.id;
              if (user_id === undefined) {
                console.error('No user id provided');
                return;
              }

              // If the user hasn't submitted topics, submit them with their default intensity
              await submitUntouchedTopics(
                topics,
                group_id,
                topicResponses,
                max_intensity
              );

              // Go through the topics and change those that are above the max intensity to the max intensity
              await filterTopicResponses(topicResponses, max_intensity);

              // Toggle the topics submitted state for the user on the group
              await toggleTopicsSubmittedState(group_id);

              // Fetch the user and members to update the interface
              await fetchUser();
              if (fetchMembers) await fetchMembers();
            }}
          >
            {hasSubmittedTopics ? 'Withdraw Response' : 'Submit Response'}
          </Button>
        </Group>
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

export default TopicList;

/**
 * Go through the topics presented to the user and submit the ones that haven't been touched with their default intensity ('Fantasy')
 * @param {Topic[]} topics The topics
 * @param {number} group_id The group id
 * @param {TopicResponse[]} topicResponses The topic responses
 * @param {TopicIntensity} max_intensity The max intensity
 * @returns {Promise<void>}
 * @async
 */

const submitUntouchedTopics = async (
  topics: Topic[],
  group_id: number,
  topicResponses: TopicResponse[],
  max_intensity: TopicIntensity
): Promise<void> => {
  const user_id = (await supabase.auth.getUser()).data.user?.id;
  if (!user_id) throw new Error('User is not logged in');

  // Get the topics that haven't been touched
  const untouchedTopics = topics.filter(
    (topic) =>
      !topicResponses.some(
        (topicResponse) => topicResponse.topic_id === topic.id
      )
  );

  // Submit untouched topics
  const { data, error } = await supabase.from('topic_response').insert(
    untouchedTopics.map((topic) => ({
      group_id,
      user_id,
      topic_id: topic.id,
      intensity: max_intensity,
    }))
  );

  if (data) console.debug('Submitted untouched topics');
  else if (error) console.error(error);
};

/**
 * Using the group max intensity, overwrite any responses that are above the max intensity
 * @param {TopicResponse[]} topicResponses - The topic responses to filter
 * @param {TopicIntensity} maxIntensity - The max intensity for the group
 * @returns {Promise<void>} - A promise that resolves when the topic responses are filtered
 * @async
 */
const filterTopicResponses = async (
  topicResponses: TopicResponse[],
  maxIntensity: TopicIntensity
): Promise<void> => {
  const intensityOrder = {
    [TopicIntensity.Fantasy]: 0,
    [TopicIntensity.Adventure]: 1,
    [TopicIntensity.Struggle]: 2,
    [TopicIntensity.Tragedy]: 3,
  };

  // Get the topic responses that are above the max intensity
  const filteredTopicResponses = topicResponses.filter(
    (topicResponse) =>
      intensityOrder[topicResponse.intensity] <= intensityOrder[maxIntensity]
  );

  if (filteredTopicResponses.length === 0) {
    console.debug(
      'filterTopicResponses: No topic responses above max intensity, skipping update'
    );
    return;
  }

  // Update the topic responses that are above the max intensity
  const { data, error } = await supabase
    .from('topic_response')
    .upsert(filteredTopicResponses);
  if (error)
    throw new Error('Could not filter topic responses: ' + error.message);
  else if (data)
    console.debug('filterTopicResponses: Topic responses filtered');
  else throw new Error('Could not filter topic responses');
};

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

/**
 * Toggle Topics Submitted State
 * Toggles the topics submitted state for a particular group
 * @param {number} group_id - The group id to toggle the topics submitted state for
 * @returns {Promise<void>}
 * @throws {Error} If there is an error toggling the topics submitted state
 */

const toggleTopicsSubmittedState = async (group_id: number): Promise<void> => {
  const user_id = (await supabase.auth.getUser()).data.user?.id;
  if (!user_id) throw new Error('User is not logged in');

  // Get current topics submitted state
  const { data, error } = await supabase
    .from('user_group')
    .select('*')
    .eq('group_id', group_id)
    .eq('user_id', user_id);

  if (error)
    throw new Error('Could not get topics submitted state: ' + error.message);
  else if (!data) throw new Error('Could not get topics submitted state');

  const topics_submitted = data[0].topics_submitted;

  // Toggle topics submitted state
  const { error: error2 } = await supabase
    .from('user_group')
    .update({ topics_submitted: !topics_submitted })
    .match({ group_id, user_id });

  if (error2)
    throw new Error(
      'Could not toggle topics submitted state: ' + error2.message
    );

  console.log('Topics submitted state toggled');
};
