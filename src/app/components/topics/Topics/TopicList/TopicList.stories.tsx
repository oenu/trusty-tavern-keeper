import type { ComponentStory, ComponentMeta } from '@storybook/react';
import TopicList from './TopicList';

const Story: ComponentMeta<typeof TopicList> = {
  component: TopicList,
  title: 'TopicList',
};
export default Story;

const Template: ComponentStory<typeof TopicList> = (args) => (
  <TopicList {...args} />
);

export const Primary = Template.bind({});
Primary.args = {};
