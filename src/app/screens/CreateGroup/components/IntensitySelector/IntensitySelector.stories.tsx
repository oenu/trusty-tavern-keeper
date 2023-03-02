import type { ComponentStory, ComponentMeta } from '@storybook/react';
import IntensitySelector from './IntensitySelector';

const Story: ComponentMeta<typeof IntensitySelector> = {
  component: IntensitySelector,
  title: 'IntensitySelector',
};
export default Story;

const Template: ComponentStory<typeof IntensitySelector> = (args) => (
  <IntensitySelector {...args} />
);

export const Primary = Template.bind({});
Primary.args = {};
