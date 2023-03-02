import type { ComponentStory, ComponentMeta } from '@storybook/react';
import { UserButton } from './UserButton';

const Story: ComponentMeta<typeof UserButton> = {
  component: UserButton,
  title: 'UserButton',
};
export default Story;

const Template: ComponentStory<typeof UserButton> = (args) => (
  <UserButton {...args} />
);

export const Primary = Template.bind({});
Primary.args = {};
