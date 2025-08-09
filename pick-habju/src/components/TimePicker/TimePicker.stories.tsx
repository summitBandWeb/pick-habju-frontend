import type { Meta, StoryObj } from '@storybook/react';
import TimePicker from './TimePicker';
import { action } from '@storybook/addon-actions';
import { TimePeriod } from './TimePickerEnums';

interface TimePickerArgs {
  initialStartHour: number;
  initialStartPeriod: TimePeriod;
  initialEndHour: number;
  initialEndPeriod: TimePeriod;
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
    initialStartHour: { control: { type: 'number', min: 1, max: 12, step: 1 } },
    initialEndHour: { control: { type: 'number', min: 1, max: 12, step: 1 } },
    initialStartPeriod: {
      control: { type: 'radio' },
      options: Object.values(TimePeriod) as TimePeriod[],
    },
    initialEndPeriod: {
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
    initialStartHour: 9,
    initialStartPeriod: TimePeriod.AM,
    initialEndHour: 5,
    initialEndPeriod: TimePeriod.PM,
    disabled: false,
  },
  render: ({ initialStartHour, initialStartPeriod, initialEndHour, initialEndPeriod, disabled }) => (
    <TimePicker
      initialStartHour={initialStartHour}
      initialStartPeriod={initialStartPeriod}
      initialEndHour={initialEndHour}
      initialEndPeriod={initialEndPeriod}
      disabled={disabled}
      onConfirm={action('onConfirm')}
      onCancel={action('onCancel')}
    />
  ),
};

export const Inactive: Story = {
  args: {
    initialStartHour: 9,
    initialStartPeriod: TimePeriod.AM,
    initialEndHour: 5,
    initialEndPeriod: TimePeriod.PM,
    disabled: true,
  },
  render: ({ initialStartHour, initialStartPeriod, initialEndHour, initialEndPeriod, disabled }) => (
    <TimePicker
      initialStartHour={initialStartHour}
      initialStartPeriod={initialStartPeriod}
      initialEndHour={initialEndHour}
      initialEndPeriod={initialEndPeriod}
      disabled={disabled}
      onConfirm={action('onConfirm')}
      onCancel={action('onCancel')}
    />
  ),
};
