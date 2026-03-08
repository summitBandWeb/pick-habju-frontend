import type { Meta, StoryObj } from '@storybook/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import Card from './Card';
import image1 from '../../assets/images/1.png';
import image2 from '../../assets/images/2.png';
import image3 from '../../assets/images/3.png';
import type { CardProps } from './Card.types';
import { BtnSizeVariant } from '../Button/ButtonEnums';

const queryClient = new QueryClient();

const meta: Meta<CardProps> = {
  title: 'Components/Card',
  component: Card,
  tags: ['autodocs'],
  decorators: [
    (Story) => (
      <QueryClientProvider client={queryClient}>
        <Story />
      </QueryClientProvider>
    ),
  ],
  parameters: {
    layout: 'centered',
    backgrounds: {
      default: 'light',
      values: [
        { name: 'dark', value: '#000000' },
        { name: 'light', value: '#ffffff' },
      ],
    },
  },
  argTypes: {
    onBookClick: { action: 'clicked', description: '예약하기 버튼 클릭' },
  },
};
export default meta;

type Story = StoryObj<CardProps>;

const baseArgs: CardProps = {
  images: [image1],
  title: '비쥬 합주실 3호점',
  subtitle: 'Modern룸',
  price: 55000,
  capacity: '12인',
  booked: false,
  btnsize: BtnSizeVariant.XXSM,
  bizItemId: 'test-biz-item-id',
  businessId: 'test-business-id',
};

// 이미지 개수별 스토리
export const OneImage: Story = {
  name: '이미지 1장',
  args: {
    ...baseArgs,
    images: [image1],
  },
};

export const TwoImages: Story = {
  name: '이미지 2장',
  args: {
    ...baseArgs,
    images: [image1, image2],
  },
};

export const ThreeImages: Story = {
  name: '이미지 3장',
  args: {
    ...baseArgs,
    images: [image1, image2, image3],
  },
};

export const FourPlusImages: Story = {
  name: '이미지 4장 이상',
  args: {
    ...baseArgs,
    images: [image1, image2, image3, image1, image2],
  },
};

// 상태별 스토리
export const Booked: Story = {
  name: '오픈 대기',
  args: {
    ...baseArgs,
    images: [image1, image2, image3],
    booked: true,
  },
};

export const PartialAvailable: Story = {
  name: '일부 시간만 가능',
  args: {
    ...baseArgs,
    images: [image1, image2, image3],
    partialAvailable: true,
    availableTimeRange: '14-15시만 가능',
  },
};
