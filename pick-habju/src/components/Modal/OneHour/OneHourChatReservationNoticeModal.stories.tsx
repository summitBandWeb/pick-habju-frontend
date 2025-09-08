import type { Meta, StoryObj } from '@storybook/react';
import { action } from '@storybook/addon-actions';
import OneHourChatReservationNoticeModal from './OneHourChatReservationNoticeModal';

const meta = {
  title: 'Modal/OneHourChatReservationNoticeModal',
  component: OneHourChatReservationNoticeModal,
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
    backgrounds: {
      default: 'dark',
      values: [
        { name: 'dark', value: '#000000' },
        { name: 'light', value: '#ffffff' },
      ],
    },
    docs: {
      description: {
        component: '1시간 예약 시 채팅문의 안내 모달입니다. 시간대 빈칸 확인을 유도합니다.',
      },
    },
  },
  decorators: [
    (Story) => (
      <div style={{ minHeight: '100vh' }}>
        <Story />
      </div>
    ),
  ],
  argTypes: {
    open: { control: 'boolean' },
    onClose: { action: 'onClose' },
    onConfirm: { action: 'onConfirm' },
  },
} satisfies Meta<typeof OneHourChatReservationNoticeModal>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    open: true,
    onClose: action('onClose'),
    onConfirm: action('onConfirm'),
  },
  render: (args) => <OneHourChatReservationNoticeModal {...args} />,
};
