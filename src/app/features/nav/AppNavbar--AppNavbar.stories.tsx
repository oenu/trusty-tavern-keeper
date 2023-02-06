import type { ComponentStory, ComponentMeta } from '@storybook/react';
import { AppNavbar } from './AppNavbar';

const Story: ComponentMeta<typeof AppNavbar> = {
  component: AppNavbar,
  title: 'AppNavbar',
};
export default Story;

const Template: ComponentStory<typeof AppNavbar> = (args) => (
  <AppNavbar {...args} />
);

export const Primary = Template.bind({});
Primary.args = {};
