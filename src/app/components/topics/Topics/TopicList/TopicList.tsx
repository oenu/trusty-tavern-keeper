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

function Topics({ group_id }: { group_id: number }) {
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
        handleTopicResponse={handleTopicResponse}
      />
    );
  });

  return (
    <Paper p="md">
      <Stack>
        <Group position="apart">
          <Title order={2}>Topic Questions</Title>
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

              // Handle empty topic responses (assume fantasy)
              await submitEmptyTopicResponses(group_id);
              // Toggle the topics submitted state
              await toggleTopicsSubmittedState(group_id);

              // Fetch the user and members
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

/**
 * Submit Empty Topic Responses
 * Submits empty topic responses for all topics at their default intensity if they haven't been submitted yet
 * @param {number} group_id - The group id to submit topic responses for
 * @returns {Promise<void>}
 * @throws {Error} If there is an error submitting topic responses
 * @async
 */
const submitEmptyTopicResponses = async (group_id: number): Promise<void> => {
  // Get user id
  const user_id = (await supabase.auth.getUser()).data.user?.id;
  if (!user_id) throw new Error('No user id provided');

  // Get all topics and topic responses
  const topics = await fetchTopics(group_id);
  const topicResponses = await fetchTopicResponses(group_id);

  // Get all topic ids that don't have a topic response
  const topicIds = topics.map((topic) => topic.id);
  const topicResponseIds = topicResponses.map(
    (topicResponse) => topicResponse.topic_id
  );
  const topicIdsWithoutResponses = topicIds.filter(
    (topicId) => !topicResponseIds.includes(topicId)
  );

  // If all topics have a topic response, do nothing
  if (topicIdsWithoutResponses.length === 0) {
    console.log('All topics have a topic response');
    return;
  }

  // Submit empty topic responses for all topics that don't have a topic response
  const topicResponsesToSubmit = topicIdsWithoutResponses.map((topicId) => ({
    topic_id: topicId,
    group_id,
    user_id,
    intensity: TopicIntensity.Fantasy,
  }));

  console.log(
    `Submitting ${topicResponsesToSubmit.length} empty topic responses`
  );

  const { error } = await supabase
    .from('topic_response')
    .insert(topicResponsesToSubmit);

  if (error)
    throw new Error('Could not submit empty topic responses: ' + error.message);
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
