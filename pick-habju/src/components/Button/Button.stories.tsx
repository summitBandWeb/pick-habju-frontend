import type { Meta, StoryObj } from '@storybook/react';
import Button from './Button';
import { BtnSizeVariant, ButtonVariant } from './ButtonEnums';

const meta: Meta<typeof Button> = {
  title: 'Components/Button',
  component: Button,
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: { type: 'select' },
      options: Object.values(ButtonVariant),
    },
    size: {
      control: { type: 'select' },
      options: Object.values(BtnSizeVariant),
    },
    disabled: {
      control: 'boolean',
    },
    label: { control: 'text' },
  },
};

export default meta;
type Story = StoryObj<typeof Button>;

export const MainDefault: Story = {
  name: 'Main Default & Hover',
  args: { label: '검색하기', variant: ButtonVariant.Main, disabled: false },
};
export const MainDisabled: Story = {
  args: { label: '검색하기', variant: ButtonVariant.Main, disabled: true },
};

export const SubDefault: Story = {
  name: 'Sub Default & Hover',
  args: { label: '검색하기', variant: ButtonVariant.Sub, disabled: false },
};
export const SubDisabled: Story = {
  args: { label: '검색하기', variant: ButtonVariant.Sub, disabled: true },
};

export const TextDefault: Story = {
  args: { label: '검색하기', variant: ButtonVariant.Text, disabled: false },
};
