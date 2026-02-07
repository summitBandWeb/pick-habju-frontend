import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import LocationInputDropdown, { type LocationOption } from './LocationInputDropdown';

const LOCATION_OPTIONS: LocationOption[] = [
  { value: 'isuyeok', label: '이수역', subwayLine: '4호선·7호선' },
  { value: 'sangdo', label: '상도역', subwayLine: '7호선' },
  { value: 'sadang', label: '사당역', subwayLine: '2호선·4호선' },
  { value: 'heukseok', label: '흑석역', subwayLine: '9호선' },
];

const meta: Meta<typeof LocationInputDropdown> = {
  title: 'Input/LocationInputDropdown',
  component: LocationInputDropdown,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
    backgrounds: {
      default: 'dark',
      values: [
        { name: 'dark', value: '#000000' },
        { name: 'light', value: '#ffffff' },
      ],
    },
  },
};

export default meta;

type Story = StoryObj<typeof LocationInputDropdown>;

const InteractiveWrapper = () => {
  const [location, setLocation] = useState('이수역');

  return (
    <div className="p-8 min-w-80">
      <LocationInputDropdown
        location={location}
        options={LOCATION_OPTIONS}
        onSelect={(value) => {
          const opt = LOCATION_OPTIONS.find((o) => o.value === value);
          setLocation(opt?.label ?? value);
          return true;
        }}
      />
    </div>
  );
};

export const Default: Story = {
  args: {
    location: '이수역',
    options: LOCATION_OPTIONS,
    onSelect: (value) => {
      console.log('지역 선택:', value);
      return true;
    },
  },
};

export const Interactive: Story = {
  name: 'Interactive (지역 선택 후 표시 업데이트)',
  render: () => <InteractiveWrapper />,
};
