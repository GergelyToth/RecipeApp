import  { type Meta, type StoryObj } from '@storybook/react';

import { Input } from '#app/components/ui/input.tsx';

const meta = {
  title: 'ui/Input',
  component: Input,
  argTypes: {
    variant: {
      options: ['default', 'box'],
      control: 'radio',
    },
    colors: {
      options: ['gray', 'black', 'white', 'whiteFull'],
      control: 'radio',
    },
  },
} satisfies Meta<typeof Input>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Primary: Story = {
  args: {
    placeholder: 'Input',
  },
};