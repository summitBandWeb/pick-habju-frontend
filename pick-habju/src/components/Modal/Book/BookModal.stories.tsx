import type { Meta, StoryObj } from '@storybook/react';
import BookModalStepper from './BookModal';

const meta = {
  title: 'Modal/BookModal',
  component: BookModalStepper,
  parameters: {
    layout: 'centered',
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
          '예약 프로세스를 위한 2단계 스테퍼 컴포넌트입니다. 1단계에서 금액을 확인하고, 2단계에서 예약 정보를 최종 확인합니다.',
      },
    },
  },
  tags: ['autodocs'],
} satisfies Meta<typeof BookModalStepper>;

export default meta;
type Story = StoryObj<typeof meta>;

// 기본 스토리
export const Default: Story = {
  name: '기본',
  args: {
    room: {
      name: "블랙룸",
      branch: "비쥬합주실 1호점",
      business_id: "522011",
      biz_item_id: "3968885",
      image_urls: ["/images/habjusil/bizu1/bizu1-black-1.jpg"],
      max_capacity: 15,
      recommend_capacity: 11,
      recommend_capacity_range: [9, 11],
      price_per_hour: 22000,
      estimated_price: 44000,
      available: true,
      available_slots: {},
      base_capacity: null,
      extra_charge: null,
      min_capacity: 1,
      min_hours: 2,
      max_hours: null,
      policy_warnings: [],
      lat: 37.5,
      lng: 126.9,
      phone_number: null,
      display_name: null,
    },
    dateIso: "2024-03-26",
    hourSlots: ["18:00", "19:00"],
    peopleCount: 12,
    onConfirm: () => alert('예약 완료!'),
    onClose: () => alert('모달 닫기'),
  },
  parameters: {
    docs: {
      description: {
        story: '기본적인 예약 스테퍼 화면입니다. 1단계 금액 확인부터 시작됩니다.',
      },
    },
  },
};

// 스테퍼 전체 플로우를 보여주는 스토리
export const FullFlow: Story = {
  name: '전체 플로우',
  args: {
    room: {
      name: "S룸",
      branch: "준사운드",
      business_id: "1384809",
      biz_item_id: "6649835",
      image_urls: ["/images/habjusil/junsound/junsound-s-1.jpg"],
      max_capacity: 13,
      recommend_capacity: 11,
      recommend_capacity_range: [9, 11],
      base_capacity: 7,
      extra_charge: 1000,
      price_per_hour: 21000,
      estimated_price: 72000,
      available: true,
      available_slots: {},
      min_capacity: 1,
      min_hours: 2,
      max_hours: null,
      policy_warnings: [],
      lat: 37.5,
      lng: 126.9,
      phone_number: null,
      display_name: null,
    },
    dateIso: "2024-03-26",
    hourSlots: ["14:00", "15:00", "16:00"],
    peopleCount: 10,
    onConfirm: () => alert('예약 완료!'),
    onClose: () => alert('모달 닫기'),
  },
  parameters: {
    docs: {
      description: {
        story: '예약 스테퍼의 전체 플로우를 확인할 수 있습니다. 각 단계를 차례로 진행해보세요.',
      },
    },
  },
};
