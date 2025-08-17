import type { Meta, StoryObj } from '@storybook/react';
import { action } from '@storybook/addon-actions';
import PastTimeUpdateModal from './PastTimeUpdateModal';
import { useEffect } from 'react';
import { useSearchStore } from '../../../store/search/searchStore';
import { SearchPhase } from '../../../store/search/searchStore.types';

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
          '검색 결과(Default) 노출 중 시작 시간이 현재를 지나 과거가 되면 표시되는 안내 모달입니다. "네,검색하기" 클릭 시 기본값을 다음 정시부터 2시간으로 보정하도록 홈 영역을 리셋합니다.',
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
    onHeroReset: { action: 'onHeroReset' },
  },
} satisfies Meta<typeof PastTimeUpdateModal>;

export default meta;
type Story = StoryObj<typeof meta>;

// 스토리에서 모달이 즉시 나타나도록, lastQuery의 시작 시간이 이미 지난 상태로 세팅
const Setup: React.FC<{ children?: React.ReactNode }> = ({ children }) => {
  useEffect(() => {
    const setPhase = useSearchStore.getState().setPhase;
    const setLastQuery = useSearchStore.getState().setLastQuery;

    // 현재 시각 기준 1시간 전을 시작 슬롯으로 설정
    const now = new Date();
    const hour = (now.getHours() + 23) % 24; // 한 시간 전
    const dateIso = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
    const slot = `${String(hour).padStart(2, '0')}:00`;

    setLastQuery({ date: dateIso, hour_slots: [slot], peopleCount: 12 });
    setPhase(SearchPhase.Default);
  }, []);
  return <>{children}</>;
};

export const Default: Story = {
  args: {
    onHeroReset: action('onHeroReset'),
  },
  render: (args) => (
    <Setup>
      <PastTimeUpdateModal {...args} />
    </Setup>
  ),
};
