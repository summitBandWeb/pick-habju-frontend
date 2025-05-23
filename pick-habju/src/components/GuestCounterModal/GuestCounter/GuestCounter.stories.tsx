import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import GuestCounter from './GuestCounter';

const meta = {
  title: 'Components/GuestCounterModal/GuestCounter',
  component: GuestCounter,
  tags: ['autodocs'],
} satisfies Meta<typeof GuestCounter>;

export default meta;
type Story = StoryObj<typeof GuestCounter>;

const ControlledTemplate = (initialProps: { value: number; min?: number; max?: number }) => {
  const [count, setCount] = useState(initialProps.value);
  return <GuestCounter value={count} onChange={setCount} min={initialProps.min} max={initialProps.max} />;
};

export const Default: Story = {
  render: () => <ControlledTemplate value={1} min={0} max={13} />,
};

export const AtMinValue: Story = {
  render: () => <ControlledTemplate value={0} min={0} max={13} />,
};

export const AtMaxValue: Story = {
  render: () => <ControlledTemplate value={13} min={0} max={13} />,
};

export const CustomRange: Story = {
  render: () => <ControlledTemplate value={5} min={3} max={13} />,
};

// TODO : Hover 기능 추가
