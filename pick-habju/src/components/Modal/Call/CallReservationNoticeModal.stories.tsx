import type { Meta, StoryObj } from '@storybook/react';
import { action } from '@storybook/addon-actions';
import CallReservationNoticeModal from './CallReservationNoticeModal';

const meta = {
  title: 'Components/Modal/CallReservationNoticeModal',
  component: CallReservationNoticeModal,
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
} satisfies Meta<typeof CallReservationNoticeModal>;

export default meta;
type Story = StoryObj<typeof CallReservationNoticeModal>;

export const Default: Story = {
  render: () => (
    <div className="w-[25.125rem] flex flex-col items-center">
      {/* 실제 사용 시에는 상위에서 오버레이로 감싸 렌더링합니다 */}
      <CallReservationNoticeModal
        open={true}
        onClose={action('onClose')}
        studioName="드림합주실 사당점"
        phoneNumber="02-1234-5678"
      />
    </div>
  ),
};
