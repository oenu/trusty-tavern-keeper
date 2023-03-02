import type { ComponentStory, ComponentMeta } from '@storybook/react';
import IntensityAccordion from './IntensityAccordion';

const Story: ComponentMeta<typeof IntensityAccordion> = {
  component: IntensityAccordion,
  title: 'IntensityAccordion',
};
export default Story;

const Template: ComponentStory<typeof IntensityAccordion> = (args) => (
  <IntensityAccordion
  // {...args}
  />
);

export const Primary = Template.bind({});
Primary.args = {};
