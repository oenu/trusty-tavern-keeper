import type { ComponentStory, ComponentMeta } from '@storybook/react';
import Survey from './Survey';

const Story: ComponentMeta<typeof Survey> = {
  component: Survey,
  title: 'Survey',
};
export default Story;

const Template: ComponentStory<typeof Survey> = (args) => (
  <Survey
  // {...args}
  />
);

export const Primary = Template.bind({});
Primary.args = {};
