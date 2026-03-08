import type { Meta, StoryObj } from '@storybook/react';
import { action } from '@storybook/addon-actions';
import { useEffect } from 'react';
import PastTimeUpdateModal from './PastTimeUpdateModal';
import useReservationStore from '../../../store/dateTime/reservationStore';

const meta = {
  title: 'Modal/PastTimeUpdateModal',
  component: PastTimeUpdateModal,
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
        component:
          '시작 시간이 현재 시각을 지나면 표시되는 안내 모달입니다. "네, 검색할게요" 클릭 시 onConfirm이 호출됩니다.',
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
    onConfirm: { action: 'onConfirm' },
  },
} satisfies Meta<typeof PastTimeUpdateModal>;

export default meta;
type Story = StoryObj<typeof meta>;

// 모달이 즉시 나타나도록 reservationStore에 1시간 전 시간을 세팅
const Setup: React.FC<{ children?: React.ReactNode }> = ({ children }) => {
  useEffect(() => {
    const now = new Date();
    const oneHourAgo = new Date(now);
    oneHourAgo.setHours(now.getHours() - 1);

    const dateIso = `${oneHourAgo.getFullYear()}-${String(oneHourAgo.getMonth() + 1).padStart(2, '0')}-${String(oneHourAgo.getDate()).padStart(2, '0')}`;
    const slot = `${String(oneHourAgo.getHours()).padStart(2, '0')}:00`;

    useReservationStore.setState({ formattedDate: dateIso, hourSlots: [slot] });
  }, []);
  return <>{children}</>;
};

export const Default: Story = {
  args: {
    onConfirm: action('onConfirm'),
  },
  render: (args) => (
    <Setup>
      <PastTimeUpdateModal {...args} />
    </Setup>
  ),
};
