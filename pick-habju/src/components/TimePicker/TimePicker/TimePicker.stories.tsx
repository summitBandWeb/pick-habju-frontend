// src/components/TimePicker/TimePicker.stories.tsx
import type { Meta, StoryObj } from '@storybook/react';
import TimePicker from './TimePicker';
import { action } from '@storybook/addon-actions';
import { TimePeriod } from '../../../enums/components';

interface TimePickerArgs {
  startHour: number;
  startPeriod: TimePeriod;
  endHour: number;
  endPeriod: TimePeriod;
  disabled: boolean;
}

const meta: Meta<TimePickerArgs> = {
  title: 'Components/TimePicker/TimePicker',
  component: TimePicker,
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
    startHour: { control: { type: 'number', min: 1, max: 12, step: 1 } },
    endHour: { control: { type: 'number', min: 1, max: 12, step: 1 } },
    startPeriod: {
      control: { type: 'radio' },
      options: Object.values(TimePeriod) as TimePeriod[],
    },
    endPeriod: {
      control: { type: 'radio' },
      options: Object.values(TimePeriod) as TimePeriod[],
    },
    disabled: { control: 'boolean' },
  },
};

export default meta;
type Story = StoryObj<TimePickerArgs>;

export const Default: Story = {
  args: {
    startHour: 9,
    startPeriod: TimePeriod.AM,
    endHour: 5,
    endPeriod: TimePeriod.PM,
    disabled: false,
  },
  render: ({ startHour, startPeriod, endHour, endPeriod, disabled }) => (
    <TimePicker
      startHour={startHour}
      startPeriod={startPeriod}
      endHour={endHour}
      endPeriod={endPeriod}
      disabled={disabled}
      onConfirm={action('onConfirm')}
      onCancel={action('onCancel')}
    />
  ),
};

export const Inactive: Story = {
  args: {
    startHour: 9,
    startPeriod: TimePeriod.AM,
    endHour: 5,
    endPeriod: TimePeriod.PM,
    disabled: true, // ← 여기만 true 로 변경
  },
  render: ({ startHour, startPeriod, endHour, endPeriod, disabled }) => (
    <TimePicker
      startHour={startHour}
      startPeriod={startPeriod}
      endHour={endHour}
      endPeriod={endPeriod}
      disabled={disabled}
      onConfirm={action('onConfirm')}
      onCancel={action('onCancel')}
    />
  ),
};
