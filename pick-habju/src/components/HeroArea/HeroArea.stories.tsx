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
  dateTime: { label: '3월 26일 (수) 18~20시', date: '2024-03-26', hour_slots: ['18:00', '19:00'] },
  peopleCount: 7,
  onDateTimeChange: () => alert('날짜 변경 클릭됨'),
  onPersonCountChange: () => alert('인원 변경 클릭됨'),
  onSearch: ({ date, hour_slots, peopleCount }) => alert(`검색: ${date}, ${hour_slots.join(',')}, ${peopleCount}명`),
};
