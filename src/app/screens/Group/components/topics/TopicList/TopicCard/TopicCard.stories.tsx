import type { ComponentStory, ComponentMeta } from '@storybook/react';
import TopicCard from './TopicCard';

// Note: This is a workaround for the fact we cant import the enum here
enum TopicIntensity {
  Fantasy = 'Fantasy',
  Adventure = 'Adventure',
  Struggle = 'Struggle',
  Tragedy = 'Tragedy',
}

const Story: ComponentMeta<typeof TopicCard> = {
  component: TopicCard,
  title: 'TopicCard',
};
export default Story;

const Template: ComponentStory<typeof TopicCard> = (args) => (
  <TopicCard {...args} />
);

export const Fantasy = Template.bind({});
Fantasy.args = {
  topic: {
    id: 1,
    name: 'Fantasy',
    description: 'Example description',
    fantasy_example: 'Example fantasy',
    adventure_example: 'Example adventure',
    tragedy_example: 'Example tragedy',
    struggle_example: 'Example struggle',
  },
  topicIntensity: TopicIntensity.Fantasy,
  isPending: false,
  responsesLoading: false,
};

export const Adventure = Template.bind({});
Adventure.args = {
  topic: {
    id: 1,
    name: 'Adventure',
    description: 'Example description',
    fantasy_example: 'Example fantasy',
    adventure_example: 'Example adventure',
    tragedy_example: 'Example tragedy',
    struggle_example: 'Example struggle',
  },
  topicIntensity: TopicIntensity.Adventure,
  isPending: false,
  responsesLoading: false,
};

export const Tragedy = Template.bind({});
Tragedy.args = {
  topic: {
    id: 1,
    name: 'Tragedy',
    description: 'Example description',
    fantasy_example: 'Example fantasy',
    adventure_example: 'Example adventure',
    tragedy_example: 'Example tragedy',
    struggle_example: 'Example struggle',
  },
  topicIntensity: TopicIntensity.Tragedy,
  isPending: false,
  responsesLoading: false,
};

export const Struggle = Template.bind({});
Struggle.args = {
  topic: {
    id: 1,
    name: 'Struggle',
    description: 'Example description',
    fantasy_example: 'Example fantasy',
    adventure_example: 'Example adventure',
    tragedy_example: 'Example tragedy',
    struggle_example: 'Example struggle',
  },
  topicIntensity: TopicIntensity.Struggle,
  isPending: false,
  responsesLoading: false,
};

export const Pending = Template.bind({});
Pending.args = {
  topic: {
    id: 1,
    name: 'Pending',
    description: 'Example description',
    fantasy_example: 'Example fantasy',
    adventure_example: 'Example adventure',
    tragedy_example: 'Example tragedy',
    struggle_example: 'Example struggle',
  },
  topicIntensity: TopicIntensity.Fantasy,
  isPending: true,
  responsesLoading: false,
};

export const ResponsesLoading = Template.bind({});
ResponsesLoading.args = {
  topic: {
    id: 1,
    name: 'ResponsesLoading',
    description: 'Example description',
    fantasy_example: 'Example fantasy',
    adventure_example: 'Example adventure',
    tragedy_example: 'Example tragedy',
    struggle_example: 'Example struggle',
  },
  topicIntensity: TopicIntensity.Fantasy,
  isPending: false,
  responsesLoading: true,
};

export const PendingResponsesLoading = Template.bind({});
PendingResponsesLoading.args = {
  topic: {
    id: 1,
    name: 'PendingResponsesLoading',
    description: 'Example description',
    fantasy_example: 'Example fantasy',
    adventure_example: 'Example adventure',
    tragedy_example: 'Example tragedy',
    struggle_example: 'Example struggle',
  },
  topicIntensity: TopicIntensity.Fantasy,
  isPending: true,
  responsesLoading: true,
};

export const NoIntensity = Template.bind({});
NoIntensity.args = {
  topic: {
    id: 1,
    name: 'NoIntensity',
    description: 'Example description',
    fantasy_example: 'Example fantasy',
    adventure_example: 'Example adventure',
    tragedy_example: 'Example tragedy',
    struggle_example: 'Example struggle',
  },
  isPending: false,
  responsesLoading: false,
};

// Actions

// Change the intensity of the topic

export const ChangeIntensity = Template.bind({});
ChangeIntensity.args = {
  topic: {
    id: 1,
    name: 'ChangeIntensity',
    description: 'Example description',
    fantasy_example: 'Example fantasy',
    adventure_example: 'Example adventure',
    tragedy_example: 'Example tragedy',
    struggle_example: 'Example struggle',
  },
  topicIntensity: TopicIntensity.Fantasy,
  isPending: false,
  responsesLoading: false,
};
