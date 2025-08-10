import type { Meta, StoryObj } from '@storybook/react';
import { action } from '@storybook/addon-actions';
import PartialReservationConfirmModal from './PartialReservationConfirmModal';

const meta = {
  title: 'Components/Modal/PartialReservationConfirmModal',
  component: PartialReservationConfirmModal,
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
} satisfies Meta<typeof PartialReservationConfirmModal>;

export default meta;
type Story = StoryObj<typeof PartialReservationConfirmModal>;

export const Default: Story = {
  render: () => (
    <div className="w-[25.125rem] flex flex-col items-center">
      <PartialReservationConfirmModal open={true} onClose={action('onClose')} availableTime="15:00 - 17:00" />
    </div>
  ),
};
