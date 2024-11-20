import  { type Meta, type StoryObj } from '@storybook/react';

import { PopularCard } from '#app/components/ui/popularCard';

const meta = {
  title: 'ui/PopularCard',
  component: PopularCard,
} satisfies Meta<typeof PopularCard>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Primary: Story = {
  args: {
    imageUrl: 'https://picsum.photos/300/300',
    link: '#',
    name: 'chocolate cake with buttercream frosting',
    rating: 4.8,
    iconName: 'outline/archive',
  },
};
