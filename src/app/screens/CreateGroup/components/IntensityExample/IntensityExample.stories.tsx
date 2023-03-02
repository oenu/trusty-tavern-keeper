import type { ComponentStory, ComponentMeta } from '@storybook/react';
import IntensityExample from './IntensityExample';

const Story: ComponentMeta<typeof IntensityExample> = {
  component: IntensityExample,
  title: 'IntensityExample',
};
export default Story;

const Template: ComponentStory<typeof IntensityExample> = (args) => (
  <IntensityExample {...args} />
);

export const Primary = Template.bind({});
Primary.args = {};
