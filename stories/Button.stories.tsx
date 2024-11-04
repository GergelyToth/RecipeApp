import  { type Meta, type StoryObj } from '@storybook/react';

import { Button } from '#app/components/ui/button';
import { Icon } from '#app/components/ui/icon';

const meta = {
  title: 'ui/Button',
  component: Button,
  argTypes: {
    size: {
      options: ['default', 'wide'],
      control: { type: 'radio' },
    }
  }
} satisfies Meta<typeof Button>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Primary: Story = {
  args: {
    children: 'Text',
  },
};

export const Outline: Story = {
  args: {
    children: 'Text',
    variant: 'outline',
  },
};

export const OutlineLight: Story = {
  args: {
    children: 'Text',
    variant: 'outlineLight',
  },
};

export const WithIcon: Story = {
  args: {
    children: <><span>Text</span><Icon name="outline/gallery-export" /></>,
    variant: 'withIcon',
  },
}

export const Error: Story = {
  args: {
    children: 'Text',
    variant: 'destructive',
  },
};
