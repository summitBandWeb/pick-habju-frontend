import type { Meta, StoryObj } from '@storybook/react';
import { action } from '@storybook/addon-actions';
import CallReservationNoticeModal from './CallReservationNoticeModal';

const meta = {
  title: 'Modal/CallReservationNoticeModal',
  component: CallReservationNoticeModal,
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
        component: '당일 예약은 전화로만 가능한 경우 노출되는 안내 모달입니다.',
      },
    },
  },
  decorators: [
    (Story) => (
      <div style={{ width: '50vw', height: '50vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Story />
      </div>
    ),
  ],
  argTypes: {
    open: { control: 'boolean' },
    studioName: { control: 'text' },
    phoneNumber: { control: 'text' },
    onClose: { action: 'onClose' },
  },
} satisfies Meta<typeof CallReservationNoticeModal>;

export default meta;
type Story = StoryObj<typeof CallReservationNoticeModal>;

export const Default: Story = {
  args: {
    open: true,
    studioName: '드림합주실 사당점',
    phoneNumber: '02-1234-5678',
    onClose: action('onClose'),
  },
  render: (args) => <CallReservationNoticeModal {...args} />,
};
