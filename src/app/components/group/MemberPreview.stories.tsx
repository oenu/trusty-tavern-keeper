import type { ComponentStory, ComponentMeta } from '@storybook/react';
import MemberPreview from './MemberPreview';

const Story: ComponentMeta<typeof MemberPreview> = {
  component: MemberPreview,
  title: 'MemberPreview',
};
export default Story;

const Template: ComponentStory<typeof MemberPreview> = (args) => (
  <MemberPreview {...args} />
);

export const Owner = Template.bind({});
Owner.args = {
  full_name: 'John Doe',
  name: 'johndoe#1234',
  discord_id: '123456789012345678',
  profile_picture:
    'https://cdn.discordapp.com/avatars/159985870458322944/b50adff099924dd5e6b72d13f77eb9d7',
  is_owner: true,
};

export const Member = Template.bind({});
Member.args = {
  full_name: 'John Doe',
  name: 'johndoe#1234',
  discord_id: '123456789012345678',
  profile_picture:
    'https://cdn.discordapp.com/avatars/159985870458322944/b50adff099924dd5e6b72d13f77eb9d7',
  is_owner: false,
};

export const NoPicture = Template.bind({});
NoPicture.args = {
  full_name: 'John Doe',
  name: 'johndoe#1234',
  discord_id: '123456789012345678',
  profile_picture: undefined,
  is_owner: false,
};

export const TopicsSubmitted = Template.bind({});
TopicsSubmitted.args = {
  full_name: 'John Doe',
  name: 'johndoe#1234',
  discord_id: '123456789012345678',
  profile_picture:
    'https://cdn.discordapp.com/avatars/159985870458322944/b50adff099924dd5e6b72d13f77eb9d7',
  is_owner: false,
  topics_submitted: true,
};
