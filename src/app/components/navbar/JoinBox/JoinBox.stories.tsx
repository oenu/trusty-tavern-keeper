import type { ComponentStory, ComponentMeta } from '@storybook/react';
import JoinBox from './JoinBox';

const Story: ComponentMeta<typeof JoinBox> = {
  component: JoinBox,
  title: 'JoinBox',
};
export default Story;

const Template: ComponentStory<typeof JoinBox> = (args) => (
  <JoinBox {...args} />
);

export const Primary = Template.bind({});
Primary.args = {};
