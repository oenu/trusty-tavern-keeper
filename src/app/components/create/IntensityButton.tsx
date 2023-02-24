import React from 'react';

// Components
import { Card, Title } from '@mantine/core';

// Types
import { TopicIntensity } from 'src/app/types/supabase-type-extensions';

// Icons
import {
  RiGhost2Fill,
  RiParentFill,
  RiSkull2Fill,
  RiUserFill,
} from 'react-icons/ri';

function IntensityButton({ intensity }: { intensity: TopicIntensity }) {
  // FAST Intensities: Fantasy, Adventure, Struggle, Tragedy

  // Icons
  const icons = {
    [TopicIntensity.Fantasy]: <RiParentFill />,
    [TopicIntensity.Adventure]: <RiUserFill />,
    [TopicIntensity.Struggle]: <RiGhost2Fill />,
    [TopicIntensity.Tragedy]: <RiSkull2Fill />,
  };

  <Card>
    <Title order={3}>{intensity}</Title>
  </Card>;
}

export default IntensityButton;
