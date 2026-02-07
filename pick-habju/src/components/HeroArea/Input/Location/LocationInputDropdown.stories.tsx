import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import LocationInputDropdown, { type LocationOption } from './LocationInputDropdown';

const LOCATION_OPTIONS: LocationOption[] = [
  { value: 'all', label: '전체' },
  { value: 'isuyeok', label: '이수역' },
  { value: 'sangdo', label: '상도역' },
  { value: 'sadang', label: '사당역' },
  { value: 'heukseok', label: '흑석역' },
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
  const [location, setLocation] = useState('전체');

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
        onClose={() => console.log('드롭다운 닫힘')}
      />
    </div>
  );
};

export const Default: Story = {
  args: {
    location: '전체',
    options: LOCATION_OPTIONS,
    onSelect: (value) => {
      console.log('지역 선택:', value);
      return true;
    },
    onClose: () => console.log('드롭다운 닫힘'),
  },
};

export const Interactive: Story = {
  name: 'Interactive (지역 선택 후 표시 업데이트)',
  render: () => <InteractiveWrapper />,
};

export const Disabled: Story = {
  args: {
    location: '이수역',
    options: LOCATION_OPTIONS,
    onSelect: () => true,
    disabled: true,
  },
};
