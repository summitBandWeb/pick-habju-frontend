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

  return (
    <div className="p-8 min-w-80">
      <PersonCountInputDropdown
        count={count}
        onConfirm={(val) => {
          setCount(val);
          return true;
        }}
        onClose={() => console.log('드롭다운 닫힘')}
      />
    </div>
  );
};

export const Default: Story = {
  args: {
    count: 12,
    onConfirm: (val) => {
      console.log('인원 확정:', val);
      return true;
    },
    onClose: () => console.log('취소 클릭'),
  },
};

export const Interactive: Story = {
  name: 'Interactive (인원 선택 후 표시 업데이트)',
  render: () => <InteractiveWrapper />,
};
