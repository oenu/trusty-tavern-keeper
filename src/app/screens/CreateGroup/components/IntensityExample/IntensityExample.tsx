// Components
import { Text } from '@mantine/core';

// Hooks
import { useEffect, useState } from 'react';
import TopicCard from 'src/app/screens/Group/components/topics/TopicList/TopicCard/TopicCard';

// Utils

// Supabase
import { supabase } from 'src/app/supabase/client';

// Types
import { Topic, TopicIntensity } from 'src/app/types/supabase-type-extensions';

function IntensityExample({ intensity }: { intensity: TopicIntensity }) {
  const [exampleTopic, setExampleTopic] = useState<Topic | null>(null);

  useEffect(() => {
    getExampleTopic();
  }, []);

  /**
   * Get a single example topic from the database to display in the intensity selector
   * @returns {Promise<void>}
   * @private
   */
  const getExampleTopic = async () => {
    const { data, error } = await supabase
      .from('topic')
      .select('*')
      .limit(1)
      .single();
    if (error) console.log(error);
    if (data) setExampleTopic(data);
  };

  return exampleTopic ? (
    <TopicCard
      topic={exampleTopic}
      isPending={false}
      responsesLoading={false}
      topicIntensity={intensity}
      maxIntensity={intensity}
      handleTopicResponse={() => {
        // do nothing
      }}
    />
  ) : (
    <Text>Loading...</Text>
  );
}

export default IntensityExample;
