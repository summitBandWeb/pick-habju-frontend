import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import PersonCountInputDropdown from './PersonCountInputDropdown';

const meta: Meta<typeof PersonCountInputDropdown> = {
  title: 'Input/PersonCountInputDropdown',
  component: PersonCountInputDropdown,
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

type Story = StoryObj<typeof PersonCountInputDropdown>;

const InteractiveWrapper = () => {
  const [count, setCount] = useState(12);
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="p-8 min-w-80">
      <PersonCountInputDropdown
        count={count}
        isOpen={isOpen}
        onOpenChange={setIsOpen}
        onConfirm={(val) => {
          setCount(val);
          return true;
        }}
      />
    </div>
  );
};

export const Default: Story = {
  args: {
    count: 12,
    isOpen: true,
    onOpenChange: (open: boolean) => console.log('Open changed:', open),
    onConfirm: (val) => {
      console.log('인원 확정:', val);
      return true;
    },
  },
};

export const Interactive: Story = {
  name: 'Interactive (인원 선택 후 표시 업데이트)',
  render: () => <InteractiveWrapper />,
};
