import React, { useState } from 'react';

// Components
import { Accordion, Group, Text } from '@mantine/core';

// Utils
import { topicIntensityDescriptions } from 'src/app/screens/Group/components/topics/topicUtils';

// Types
import { TopicIntensity } from 'src/app/types/supabase-type-extensions';

function IntensityAccordion() {
  const [accordionValue, setAccordionValue] = useState<TopicIntensity>(
    TopicIntensity.Fantasy
  );

  return (
    // Accordion to show intensity details
    <Accordion
      my={'md'}
      variant="contained"
      chevronPosition="left"
      // defaultOpened={groupIntensity}
      onChange={(value) => setAccordionValue(value as TopicIntensity)}
      value={accordionValue}
    >
      {Object.values(TopicIntensity).map((intensity) => {
        const { title, description, icon, shortDescription } =
          topicIntensityDescriptions[intensity];
        return (
          <Accordion.Item value={intensity} key={intensity}>
            <Accordion.Control>
              <Group noWrap>
                {icon}
                <div>
                  <Text>{title}</Text>
                  <Text size="sm">{shortDescription}</Text>
                </div>
              </Group>
            </Accordion.Control>
            <Accordion.Panel>{description}</Accordion.Panel>
          </Accordion.Item>
        );
      })}
    </Accordion>
  );
}

export default IntensityAccordion;
