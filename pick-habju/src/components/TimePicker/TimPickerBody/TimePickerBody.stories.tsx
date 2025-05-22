import type { Meta, StoryObj } from '@storybook/react';
import { action } from '@storybook/addon-actions';
import { TimePickerBody } from './TimePickerBody';
import type { TimePickerBodyProps } from './TimePickerBody.types';
import { TimePeriod } from '../TimePickerEnums';

const meta: Meta<TimePickerBodyProps> = {
  title: 'Components/TimePicker/TimePickerBody',
  component: TimePickerBody,
  tags: ['autodocs'],
  parameters: {
    backgrounds: {
      default: 'dark',
      values: [
        { name: 'dark', value: '#000000' },
        { name: 'light', value: '#ffffff' },
      ],
    },
    layout: 'centered',
  },
  argTypes: {
    startHour: { control: 'number', min: 1, max: 12 },
    endHour: { control: 'number', min: 1, max: 12 },
    startPeriod: { control: 'radio', options: ['AM', 'PM'] },
    endPeriod: { control: 'radio', options: ['AM', 'PM'] },
    disabled: { control: 'boolean' },
  },
};

export default meta;
type Story = StoryObj<TimePickerBodyProps>;

export const Default: Story = {
  args: {
    startHour: 9,
    startPeriod: TimePeriod.AM,
    endHour: 5,
    endPeriod: TimePeriod.PM,
    disabled: false,
    onChange: action('onChange'),
  },
};
