import type { Meta, StoryObj } from '@storybook/react';
import { action } from '@storybook/addon-actions';
import GuestCounterModal from './GuestCounterModal';

const meta = {
  title: 'Components/GuestCounterModal',
  component: GuestCounterModal,
  tags: ['autodocs'],
  parameters: {
    backgrounds: {
      default: 'dark',
      values: [
        { name: 'dark', value: '#000000' },
        { name: 'light', value: '#ffffff' },
      ],
    },
  },
} satisfies Meta<typeof GuestCounterModal>;

export default meta;
type Story = StoryObj<typeof GuestCounterModal>;

// 항상 열린 상태로 표시하는 템플릿
const AlwaysOpenTemplate = (args: { initialCount?: number }) => {
  return (
    <GuestCounterModal
      open={true}
      onClose={action('onClose')}
      onConfirm={action('onConfirm')}
      initialCount={args.initialCount}
    />
  );
};

export const Defalut: Story = {
  render: () => <AlwaysOpenTemplate initialCount={12} />,
  parameters: {
    docs: {
      description: {
        story: '항상 열린 상태로 표시되는 모달입니다. UI 확인용으로 사용하세요.',
      },
    },
  },
};

export const WithInitialCount5: Story = {
  render: () => <AlwaysOpenTemplate initialCount={5} />,
  parameters: {
    docs: {
      description: {
        story: '초기 인원이 5명으로 설정된 모달입니다.',
      },
    },
  },
};

export const WithInitialCountMax: Story = {
  render: () => <AlwaysOpenTemplate initialCount={30} />,
  parameters: {
    docs: {
      description: {
        story: '최대 인원(30명)으로 초기값이 설정된 모달입니다.',
      },
    },
  },
};
