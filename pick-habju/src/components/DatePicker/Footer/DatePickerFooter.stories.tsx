import type { Meta, StoryObj } from '@storybook/react';
import { action } from '@storybook/addon-actions';
import DatePickerFooter, { type DatePickerFooterProps } from './DatePickerFooter';

const meta: Meta<DatePickerFooterProps> = {
  title: 'Components/DatePicker/DatePickerFooter',
  component: DatePickerFooter,
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

type Story = StoryObj<DatePickerFooterProps>;

export const Default: Story = {
  args: {
    onConfirm: action('확인 클릭'),
    onCancel: action('취소 클릭'),
  },
};
