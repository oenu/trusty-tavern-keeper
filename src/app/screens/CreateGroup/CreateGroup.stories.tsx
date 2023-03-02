import type { ComponentStory, ComponentMeta } from '@storybook/react';
import CreateGroup from './CreateGroup';

const Story: ComponentMeta<typeof CreateGroup> = {
  component: CreateGroup,
  title: 'CreateGroup',
};
export default Story;

const Template: ComponentStory<typeof CreateGroup> = (args) => (
  <CreateGroup {...args} />
);

export const Primary = Template.bind({});
Primary.args = {};
