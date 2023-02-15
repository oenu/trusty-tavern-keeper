import type { ComponentStory, ComponentMeta } from '@storybook/react';
import Home from './Home';

const Story: ComponentMeta<typeof Home> = {
  component: Home,
  title: 'Home',
};
export default Story;

const Template: ComponentStory<typeof Home> = (args) => (
  <Home
  // {...args}
  />
);

export const Primary = Template.bind({});
Primary.args = {};
