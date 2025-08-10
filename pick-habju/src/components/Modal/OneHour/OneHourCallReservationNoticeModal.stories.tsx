import type { Meta, StoryObj } from '@storybook/react';
import { action } from '@storybook/addon-actions';
import OneHourCallReservationNoticeModal from './OneHourCallReservationNoticeModal';

const meta = {
  title: 'Modal/OneHourCallReservationNoticeModal',
  component: OneHourCallReservationNoticeModal,
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
        component: '1시간 예약 알림 모달입니다. 앞뒤로 예약현황을 확인할 수 있습니다.',
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
    studioName: { control: 'text' },
    phoneNumber: { control: 'text' },
    confirmHref: { control: 'text' },
    onClose: { action: 'onClose' },
  },
} satisfies Meta<typeof OneHourCallReservationNoticeModal>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    open: true,
    studioName: '드림합주실 사당점',
    phoneNumber: '02-1234-5678',
    confirmHref: 'https://www.example.com/call-info',
    onClose: action('onClose'),
  },
  render: (args) => <OneHourCallReservationNoticeModal {...args} />,
};
