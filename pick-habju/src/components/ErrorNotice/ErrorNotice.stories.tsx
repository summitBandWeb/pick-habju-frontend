import type { Meta, StoryObj } from '@storybook/react';
import ErrorNotice from './ErrorNotice';

const meta = {
  title: 'Components/ErrorNotice',
  component: ErrorNotice,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  decorators: [
    (Story) => (
      <div className="relative w-[402px] h-[774px] bg-yellow-300">
        {/* 지도 배경 목업 */}
        <div className="absolute inset-0 bg-gradient-to-br from-gray-200 to-gray-400">
          <div className="absolute top-[100px] left-[50%] -translate-x-1/2 w-[380px] h-[58px] bg-white rounded-[15px] shadow-[0px_4px_8px_0px_rgba(0,0,0,0.2)] flex items-center px-[15px]">
            <span className="text-gray-400 text-[14px]">결과 내 합주실 검색</span>
          </div>
        </div>
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof ErrorNotice>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * 검색 조건에 맞는 결과가 없는 경우
 * - 경고 아이콘 표시
 * - "검색하기" 버튼 클릭으로 돌아가기
 */
export const NoResults: Story = {
  args: {
    type: 'noResults',
    onClose: () => {
      console.log('검색하기 버튼 클릭');
    },
  },
};

/**
 * 서버 응답 지연 시
 * - 로딩 스피너 애니메이션 표시
 * - 버튼 없음
 */
export const Loading: Story = {
  args: {
    type: 'loading',
  },
};

/**
 * 필터링된 결과가 없는 경우 (일부 시간만 가능 / 찜한 합주실)
 * - 위치 X 마커 아이콘 표시
 * - 3초 후 자동으로 필터 비활성화 & 원래 화면 복귀
 */
export const NoMatch: Story = {
  args: {
    type: 'noMatch',
    autoHideAfter: 3000,
    onAutoHide: () => {
      console.log('3초 후 자동 복귀 - 필터 버튼 비활성화');
    },
  },
  parameters: {
    docs: {
      description: {
        story: '이 스토리는 3초 후 자동으로 사라집니다. Actions 패널에서 onAutoHide 호출을 확인하세요.',
      },
    },
  },
};
