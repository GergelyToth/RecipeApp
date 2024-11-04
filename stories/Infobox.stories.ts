import  { type Meta, type StoryObj } from '@storybook/react';

import { Infobox } from '#app/components/ui/infobox.tsx';

const meta = {
  title: 'ui/Infobox',
  component: Infobox,
} satisfies Meta<typeof Infobox>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Primary: Story = {
  args: {
    iconName: 'outline/arrow-circle-down',
    info: 'Low Calory'
  },
};
