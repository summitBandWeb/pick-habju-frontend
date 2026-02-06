import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import { action } from '@storybook/addon-actions';
import { TimePickerInlineInput } from './TimePickerInlineInput';
import type { TimePickerInlineInputProps } from './TimePickerInlineInput';
import { TimePeriod } from '../TimePickerEnums';

const meta: Meta<TimePickerInlineInputProps> = {
  title: 'Components/TimePicker/TimePickerInlineInput',
  component: TimePickerInlineInput,
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
  },
};

export default meta;
type Story = StoryObj<TimePickerInlineInputProps>;

export const Default: Story = {
  args: {
    startHour: 3,
    startPeriod: TimePeriod.AM,
    endHour: 3,
    endPeriod: TimePeriod.AM,
    onChange: action('onChange'),
  },
};

export const Interactive: Story = {
  render: function InteractiveStory() {
    const [time, setTime] = useState({
      startHour: 6,
      startPeriod: TimePeriod.AM,
      endHour: 9,
      endPeriod: TimePeriod.AM,
    });
    return (
      <div className="flex flex-col gap-4">
        <TimePickerInlineInput
          startHour={time.startHour}
          startPeriod={time.startPeriod}
          endHour={time.endHour}
          endPeriod={time.endPeriod}
          onChange={(sh, sp, eh, ep) =>
            setTime({ startHour: sh, startPeriod: sp, endHour: eh, endPeriod: ep })
          }
        />
        <p className="text-sm text-gray-400">
          현재: {time.startHour} {time.startPeriod} ~ {time.endHour} {time.endPeriod}
        </p>
      </div>
    );
  },
};
