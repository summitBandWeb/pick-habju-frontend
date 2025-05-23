import type { Meta, StoryObj } from '@storybook/react';
import Card from './Card';
import image1 from '../../assets/images/1.png';
import image2 from '../../assets/images/2.png';
import image3 from '../../assets/images/3.png';
import type { CardProps } from './Card.types';
import { BtnSizeVariant } from '../Button/ButtonEnums';

const exampleImages = [image1, image2, image3];

const meta: Meta<CardProps> = {
  title: 'Components/Card',
  component: Card,
  tags: ['autodocs'],
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
    images: { control: 'object' },
    title: { control: 'text' },
    subtitle: { control: 'text' },
    price: { control: 'number' },
    locationText: { control: 'text' },
    walkTime: { control: 'text' },
    capacity: { control: 'text' },
    booked: { control: 'boolean' },
    initialIndex: {
      control: { type: 'number', min: 0, max: exampleImages.length - 1, step: 1 },
      description: '처음 보여줄 슬라이드 인덱스',
    },
    btnsize: {
      control: { type: 'select' },
      options: Object.values(BtnSizeVariant),
      description: '버튼 크기',
    },
  },
};
export default meta;

type Story = StoryObj<CardProps>;

export const First: Story = {
  args: {
    images: exampleImages,
    title: '비쥬 합주실 3호점',
    subtitle: 'Modern룸',
    price: 55000,
    locationText: '이수역',
    walkTime: '4분',
    capacity: '12인',
    booked: false,
    initialIndex: 0,
    btnsize: BtnSizeVariant.XSM,
  },
};

export const Middle: Story = {
  name: '두 번째 이미지',
  args: {
    ...First.args!,
    initialIndex: 1,
  },
};

export const Last: Story = {
  name: '마지막 이미지',
  args: {
    ...First.args!,
    initialIndex: exampleImages.length - 1,
  },
};

// 예약 마감 상태
export const Booked: Story = {
  name: '예약 마감',
  args: {
    ...First.args!,
    booked: true,
  },
};
