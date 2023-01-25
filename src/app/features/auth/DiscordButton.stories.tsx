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

export const SignedIn = Template.bind({});
SignedIn.args = {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  session: {} as any,
};

export const SignedOut_label = Template.bind({});
SignedOut_label.args = {
  label: true,
};

export const SignedOut_noLabel = Template.bind({});
SignedOut_noLabel.args = {
  label: false,
};
