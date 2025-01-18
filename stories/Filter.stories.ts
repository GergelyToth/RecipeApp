import { type Meta, type StoryObj } from '@storybook/react';

import { Filter } from '#app/components/filter.tsx';

const meta = {
  title: 'components/Filter',
  component: Filter,
} satisfies Meta<typeof Filter>;

export default meta;
type Story = StoryObj<typeof meta>;

const setFilterValues = (filterValues: string[] | undefined) => {
  console.log('setting filter values to:', filterValues);
};

export const Primary: Story = {
  args: {
    setFilterValues,
    title: 'My filter title',
    options: [
      {
        label: 'my label',
        value: 'my value',
      },
      {
        label: 'my label 2',
        value: 'my value 2',
      },
      {
        label: 'my label 3',
        value: 'my value 3',
      },
      {
        label: 'my label 4',
        value: 'my value 4',
      },
    ],
  },
};
