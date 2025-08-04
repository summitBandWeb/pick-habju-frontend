import type { Meta, StoryFn } from '@storybook/react';
import HeroArea from './HeroArea';

export default {
  title: 'Components/HeroArea',
  component: HeroArea,
  parameters: {
    layout: 'centered',
    backgrounds: {
      default: 'dark',
      values: [
        { name: 'dark', value: '#000000' },
        { name: 'light', value: '#ffffff' },
      ],
    },
  },
  tags: ['autodocs'],
} as Meta<typeof HeroArea>;

const Template: StoryFn<typeof HeroArea> = (args) => <HeroArea {...args} />;

export const Default = Template.bind({});
Default.args = {
  dateTime: '3월 26일 (수) 18-20시',
  peopleCount: 7,
  onDateTimeChange: () => alert('날짜 변경 클릭됨'),
  onPersonCountChange: () => alert('인원 변경 클릭됨'),
  onSearch: () => alert('검색하기 클릭됨'),
};
