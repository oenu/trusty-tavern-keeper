import type { ComponentStory, ComponentMeta } from '@storybook/react';
import Group from './Group';

const Story: ComponentMeta<typeof Group> = {
  component: Group,
  title: 'Group',
};
export default Story;

const Template: ComponentStory<typeof Group> = (args) => (
  <Group
  // {...args}
  />
);

export const Primary = Template.bind({});
Primary.args = {};
