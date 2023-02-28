// Components
import {
  Box,
  Card,
  Center,
  Overlay,
  SegmentedControl,
  Stack,
  Text,
  Title,
} from '@mantine/core';
import IntensityAccordion from '../IntensityAccordion/IntensityAccordion';

// Utils
import { topicIntensityIcons } from 'src/app/components/topics/utils';

// Types
import { TopicIntensity } from 'src/app/types/supabase-type-extensions';
import IntensityExample from '../IntensityExample/IntensityExample';

function IntensitySelector({
  groupIntensity,
  setGroupIntensity,
}: {
  groupIntensity: TopicIntensity;
  setGroupIntensity: (intensity: TopicIntensity) => void;
}) {
  return (
    <Stack>
      <Card>
        <Title order={2} mb={'md'}>
          Group Intensity
        </Title>
        <Text>
          When playing a Roleplay game, some players will want to be more
          'Intense' in their descriptions of their characters actions. For
          example, players might have very different expectations of what it
          means to 'attack' in a game. Some players are comfortable with
          visceral descriptions of violence, while others prefer to keep things
          more PG. This setting allows you to set a group intensity level that
          will be used as an upper limit for all topics. Players can override
          this setting for individual topics.
        </Text>
        <IntensityAccordion />

        <Card withBorder>
          <SegmentedControl
            w="100%"
            mb={'md'}
            value={groupIntensity}
            data={Object.keys(TopicIntensity).map((intensity) => ({
              label: (
                <Center>
                  {topicIntensityIcons[intensity as TopicIntensity]}
                  <Box ml={10}>{intensity}</Box>
                </Center>
              ),
              value: intensity,
            }))}
            onChange={(value) => setGroupIntensity(value as TopicIntensity)}
          />
          <Card>
            <IntensityExample intensity={groupIntensity} />
            <Overlay opacity={0.05} />
          </Card>
        </Card>
      </Card>
    </Stack>
  );
}

export default IntensitySelector;