import type { ComponentStory, ComponentMeta } from '@storybook/react';
import TopicReport from './TopicReport';

const Story: ComponentMeta<typeof TopicReport> = {
  component: TopicReport,
  title: 'TopicReport',
};
export default Story;

const Template: ComponentStory<typeof TopicReport> = (args) => (
  <TopicReport {...args} />
);

export const Group1 = Template.bind({});
Group1.args = {
  group_id: 1,
};
