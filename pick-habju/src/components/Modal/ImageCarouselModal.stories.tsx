import type { Meta, StoryObj } from '@storybook/react';
import { action } from '@storybook/addon-actions';
import ImageCarouselModal from './ImageCarouselModal';
import image1 from '../../assets/images/1.png';
import image2 from '../../assets/images/2.png';
import image3 from '../../assets/images/3.png';

const meta = {
  title: 'Modal/ImageCarouselModal',
  component: ImageCarouselModal,
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
        component: '이미지 영역 클릭 시 상세 이미지를 캐러셀 형태로 보여주는 모달입니다.',
      },
    },
  },
  argTypes: {
    images: { control: false, description: '이미지 URL 배열' },
    initialIndex: { control: 'number', description: '초기 표시 이미지 인덱스' },
    onClose: { action: 'onClose', description: '닫기 버튼 클릭' },
  },
} satisfies Meta<typeof ImageCarouselModal>;

export default meta;
type Story = StoryObj<typeof ImageCarouselModal>;

export const Default: Story = {
  name: '기본',
  args: {
    images: [image1, image2, image3],
    onClose: action('onClose'),
  },
};

export const OneImage: Story = {
  name: '이미지 1장',
  args: {
    images: [image1],
    onClose: action('onClose'),
  },
};

export const InitialIndex: Story = {
  name: '특정 인덱스부터 시작',
  args: {
    images: [image1, image2, image3],
    initialIndex: 2,
    onClose: action('onClose'),
  },
};
