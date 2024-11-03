import  { type Meta, type StoryObj } from '@storybook/react';

import { State } from '#app/components/ui/state.tsx';

const meta = {
  title: 'ui/State',
  component: State,
} satisfies Meta<typeof State>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Active: Story = {
  args: {
    name: 'Tags',
    active: true,
  },
}

export const InActive: Story = {
  args: {
    name: 'Tags',
    active: false,
  },
}
