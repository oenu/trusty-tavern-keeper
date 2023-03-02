import type { ComponentStory, ComponentMeta } from '@storybook/react';
import ContentReport from './ContentReport';

const Story: ComponentMeta<typeof ContentReport> = {
  component: ContentReport,
  title: 'ContentReport',
};
export default Story;

const Template: ComponentStory<typeof ContentReport> = (args) => (
  <ContentReport {...args} />
);

export const Group1 = Template.bind({});
Group1.args = {
  group_id: 1,
};
