import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import LocationInputDropdown, { type LocationOption } from './LocationInputDropdown';

const LOCATION_OPTIONS: LocationOption[] = [
  { id: 'isuyeok', name: '이수역', subwayLine: '4호선·7호선', coordinates: { lat: 37.4865, lng: 126.9818 } },
  { id: 'sangdo', name: '상도역', subwayLine: '7호선', coordinates: { lat: 37.5025, lng: 126.9492 } },
  { id: 'sadang', name: '사당역', subwayLine: '2호선·4호선', coordinates: { lat: 37.4767, lng: 126.9816 } },
  { id: 'heukseok', name: '흑석역', subwayLine: '9호선', coordinates: { lat: 37.5086, lng: 126.9616 } },
  { id: 'gimpo', name: '김포공항역', subwayLine: '공항철도·5호선·9호선', coordinates: { lat: 37.5621, lng: 126.8014 } },
  { id: 'digital', name: '디지털미디어시티역', subwayLine: '6호선·경의중앙선·공항철도', coordinates: { lat: 37.5772, lng: 126.9006 } },
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
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="p-8 min-w-80">
      <LocationInputDropdown
        location={location}
        options={LOCATION_OPTIONS}
        isOpen={isOpen}
        onOpenChange={setIsOpen}
        onSelect={(option) => {
          setLocation(option.name);
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
    isOpen: true,
    onOpenChange: (open: boolean) => console.log('Open changed:', open),
    onSelect: (option) => {
      console.log('지역 선택:', option);
      return true;
    },
  },
};

export const Interactive: Story = {
  name: 'Interactive (지역 선택 후 표시 업데이트)',
  render: () => <InteractiveWrapper />,
};
