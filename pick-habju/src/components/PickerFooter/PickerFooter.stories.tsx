import type { Meta, StoryObj } from '@storybook/react';
import { action } from '@storybook/addon-actions';
import type { PickerFooterProps } from './PickerFooter.types';
import PickerFooter from './PickerFooter';

const meta: Meta<PickerFooterProps> = {
  title: 'Components/PickerFooter',
  component: PickerFooter,
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
    onConfirm: { action: '확인 클릭' },
    onCancel: { action: '취소 클릭' },
  },
};

export default meta;

type Story = StoryObj<PickerFooterProps>;

export const Default: Story = {
  args: {
    onConfirm: action('확인 클릭'),
    onCancel: action('취소 클릭'),
  },
};

export const DatePickerFooter: Story = {
  args: {
    onConfirm: action('확인 클릭'),
    onCancel: action('취소 클릭'),
    cancelText: '뒤로가기',
  },
};
