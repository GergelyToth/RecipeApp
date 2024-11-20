import  { type Meta, type StoryObj } from '@storybook/react';

import { Search } from '#app/components/ui/search.tsx';

const meta = {
  title: 'ui/Search',
  component: Search,
} satisfies Meta<typeof Search>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Primary: Story = {
  args: {},
};
