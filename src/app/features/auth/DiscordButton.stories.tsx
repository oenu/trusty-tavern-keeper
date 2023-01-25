import type { ComponentStory, ComponentMeta } from '@storybook/react';
import { DiscordButton } from './DiscordButton';

const Story: ComponentMeta<typeof DiscordButton> = {
  component: DiscordButton,
  title: 'DiscordButton',
};
export default Story;

const Template: ComponentStory<typeof DiscordButton> = (args) => (
  <DiscordButton {...args} />
);

export const Primary = Template.bind({});
Primary.args = {};
