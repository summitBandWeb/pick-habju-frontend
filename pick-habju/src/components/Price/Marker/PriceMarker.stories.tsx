import type { Meta, StoryObj } from '@storybook/react';
import PriceMarker from './PriceMarker';

const meta: Meta<typeof PriceMarker> = {
  title: 'Components/Price/PriceMarker',
  component: PriceMarker,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
    // 지도 배경색과 유사한 어두운 회색으로 설정
    backgrounds: {
      default: 'map',
      values: [
        { name: 'map', value: '#4a4a4a' },
        { name: 'light', value: '#ffffff' },
      ],
    },
  },
  argTypes: {
    level: {
      control: { type: 'inline-radio' },
      options: [1, 2, 3],
      description: '1=아이콘+텍스트 / 2=아이콘만 / 3=점 마커',
    },
    name: { control: 'text' },
    price: { control: 'text' },
    isFave: { control: 'boolean' },
    isPartial: { control: 'boolean' },
    isActive: { control: 'boolean' },
    extraRoomCount: {
      control: { type: 'number', min: 0, max: 9 },
      description: '0이면 chip 숨김. 표시 숫자 = extraRoomCount + 1',
    },
  },
};

export default meta;
type Story = StoryObj<typeof PriceMarker>;

const baseArgs = {
  name: '비쥬 합주실',
  price: '29,000~',
  isActive: false,
  extraRoomCount: 0,
};

// ── Level 1: 아이콘 + 텍스트 ────────────────────────────────────────────────

export const Level1Default: Story = {
  name: 'Level 1 — Default',
  args: { ...baseArgs, level: 1, isFave: false, isPartial: false },
};

export const Level1Fave: Story = {
  name: 'Level 1 — 즐겨찾기',
  args: { ...baseArgs, level: 1, isFave: true, isPartial: false },
};

export const Level1Partial: Story = {
  name: 'Level 1 — 부분예약',
  args: { ...baseArgs, level: 1, isFave: false, isPartial: true },
};

export const Level1FavePartial: Story = {
  name: 'Level 1 — 즐겨찾기 + 부분예약',
  args: { ...baseArgs, level: 1, isFave: true, isPartial: true },
};

export const Level1WithChip: Story = {
  name: 'Level 1 — 복수 룸 (Chip)',
  args: { ...baseArgs, level: 1, isFave: false, isPartial: false, extraRoomCount: 2 },
};

export const Level1Active: Story = {
  name: 'Level 1 — Selected (isActive)',
  args: { ...baseArgs, level: 1, isFave: false, isPartial: false, isActive: true },
};

export const Level1FaveWithChipActive: Story = {
  name: 'Level 1 — 즐겨찾기 + Chip + Selected',
  args: { ...baseArgs, level: 1, isFave: true, isPartial: false, extraRoomCount: 3, isActive: true },
};

// ── Level 2: 아이콘만 ────────────────────────────────────────────────────────

export const Level2Default: Story = {
  name: 'Level 2 — Default (아이콘만)',
  args: { ...baseArgs, level: 2, isFave: false, isPartial: false },
};

export const Level2Fave: Story = {
  name: 'Level 2 — 즐겨찾기',
  args: { ...baseArgs, level: 2, isFave: true, isPartial: false },
};

export const Level2Partial: Story = {
  name: 'Level 2 — 부분예약',
  args: { ...baseArgs, level: 2, isFave: false, isPartial: true },
};

export const Level2FavePartial: Story = {
  name: 'Level 2 — 즐겨찾기 + 부분예약',
  args: { ...baseArgs, level: 2, isFave: true, isPartial: true },
};

export const Level2WithChip: Story = {
  name: 'Level 2 — 복수 룸 (Chip)',
  args: { ...baseArgs, level: 2, isFave: false, isPartial: false, extraRoomCount: 2 },
};

// ── Level 3: 점 마커 ─────────────────────────────────────────────────────────

export const Level3Dot: Story = {
  name: 'Level 3 — 점 마커',
  args: { ...baseArgs, level: 3, isFave: false, isPartial: false },
};

// ── 4가지 아이콘 상태 한눈에 비교 ──────────────────────────────────────────

export const AllIconStates: Story = {
  name: '아이콘 4가지 상태 비교',
  render: () => (
    <div className="flex gap-6 items-end">
      <div className="flex flex-col items-center gap-2">
        <PriceMarker level={2} name="" price="" isFave={false} isPartial={false} isActive={false} extraRoomCount={0} />
        <span className="text-white text-xs">Default</span>
      </div>
      <div className="flex flex-col items-center gap-2">
        <PriceMarker level={2} name="" price="" isFave={true} isPartial={false} isActive={false} extraRoomCount={0} />
        <span className="text-white text-xs">즐겨찾기</span>
      </div>
      <div className="flex flex-col items-center gap-2">
        <PriceMarker level={2} name="" price="" isFave={false} isPartial={true} isActive={false} extraRoomCount={0} />
        <span className="text-white text-xs">부분예약</span>
      </div>
      <div className="flex flex-col items-center gap-2">
        <PriceMarker level={2} name="" price="" isFave={true} isPartial={true} isActive={false} extraRoomCount={0} />
        <span className="text-white text-xs">즐겨찾기+부분</span>
      </div>
    </div>
  ),
};

// ── 3단계 레벨 비교 ──────────────────────────────────────────────────────────

export const AllLevels: Story = {
  name: '3단계 레벨 비교',
  render: () => (
    <div className="flex gap-8 items-end">
      <div className="flex flex-col items-center gap-2">
        <PriceMarker level={1} name="비쥬 합주실" price="29,000~" isFave={false} isPartial={false} isActive={false} extraRoomCount={0} />
        <span className="text-white text-xs">Level 1</span>
      </div>
      <div className="flex flex-col items-center gap-2">
        <PriceMarker level={2} name="비쥬 합주실" price="29,000~" isFave={false} isPartial={false} isActive={false} extraRoomCount={0} />
        <span className="text-white text-xs">Level 2</span>
      </div>
      <div className="flex flex-col items-center gap-2">
        <PriceMarker level={3} name="비쥬 합주실" price="29,000~" isFave={false} isPartial={false} isActive={false} extraRoomCount={0} />
        <span className="text-white text-xs">Level 3</span>
      </div>
    </div>
  ),
};
