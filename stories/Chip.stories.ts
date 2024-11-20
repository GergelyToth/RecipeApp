import  { type Meta, type StoryObj } from '@storybook/react';

import { Chips } from '#app/components/ui/chips.tsx';

const meta = {
  title: 'ui/Chips',
  component: Chips,
} satisfies Meta<typeof Chips>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Active: Story = {
  args: {
    name: 'Chicken',
    active: true,
  },
};

export const Inactive: Story = {
  args: {
    name: 'Chicken',
    active: false,
  },
  parameters: {
    backgrounds: {
      default: 'Dark',
    },
  },
};
