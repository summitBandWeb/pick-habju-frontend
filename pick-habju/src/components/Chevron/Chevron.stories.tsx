import type { Meta, StoryObj } from '@storybook/react';
import Chevron from './Chevron';
import { ChevronVariant } from './ChevronEnums';

const meta: Meta<typeof Chevron> = {
  title: 'Components/Chevron',
  component: Chevron,
  tags: ['autodocs'],
  parameters: {
    backgrounds: {
      default: 'dark',
      values: [
        { name: 'dark', value: '#000000' },
        { name: 'light', value: '#ffffff' },
      ],
    },
  },
  argTypes: {
    variant: {
      control: { type: 'select' },
      options: Object.values(ChevronVariant),
    },
    onPrev: { action: 'clicked prev' },
    onNext: { action: 'clicked next' },
  },
};
export default meta;

type Story = StoryObj<typeof Chevron>;

export const First: Story = {
  args: {
    variant: ChevronVariant.First,
  },
};

export const Middle: Story = {
  args: {
    variant: ChevronVariant.Middle,
  },
};

export const Last: Story = {
  args: {
    variant: ChevronVariant.Last,
  },
};
