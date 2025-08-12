import type { Meta, StoryObj } from '@storybook/react';
import PartialReservationConfirmModal from './PartialReservationConfirmModal';

const meta = {
  title: 'Modal/PartialReservationConfirmModal',
  component: PartialReservationConfirmModal,
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
        component: '일부 시간만 가능한 경우 가능한 시간대를 안내하고 확인을 받는 모달입니다.',
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
    availableTime: { control: 'text' },
    confirmHref: { control: 'text' },
    onClose: { action: 'onClose' },
  },
} satisfies Meta<typeof PartialReservationConfirmModal>;

export default meta;
type Story = StoryObj<typeof PartialReservationConfirmModal>;

export const Playground: Story = {
  args: {
    open: true,
    availableTime: '15:00 - 17:00',
    confirmHref: 'https://www.google.com',
  },
  render: (args) => <PartialReservationConfirmModal {...args} />,
};
