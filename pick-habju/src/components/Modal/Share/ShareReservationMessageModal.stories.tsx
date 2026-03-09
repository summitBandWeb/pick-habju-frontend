import type { Meta, StoryObj } from '@storybook/react';
import ShareReservationMessageModal from './ShareReservationMessageModal';
import ModalOverlay from '../ModalOverlay';

const meta: Meta<typeof ShareReservationMessageModal> = {
  title: 'Modal/ShareReservationMessageModal',
  component: ShareReservationMessageModal,
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
        component: '예약 일정을 공유 메시지 형태로 보여주고, 공유 후 예약 또는 건너뛰기 선택 모달입니다.',
      },
    },
  },
  decorators: [
    (Story) => (
      <ModalOverlay open onClose={() => {}} dimmedClassName="bg-black/80">
        <Story />
      </ModalOverlay>
    ),
  ],
  argTypes: {
    onShare: { action: 'onShare' },
    onSkip: { action: 'onSkip' },
  },
};

export default meta;

type Story = StoryObj<typeof ShareReservationMessageModal>;

export const Playground: Story = {
  args: {},
};
