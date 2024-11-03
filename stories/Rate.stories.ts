import  { type Meta, type StoryObj } from '@storybook/react';

import { Rate } from '#app/components/ui/rate.tsx';

const meta = {
  title: 'ui/Rate',
  component: Rate,
} satisfies Meta<typeof Rate>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Primary: Story = {
  args: {
    rating: 4.8,
  },
}
