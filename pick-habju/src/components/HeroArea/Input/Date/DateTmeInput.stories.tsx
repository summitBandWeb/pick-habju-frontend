import type { Meta, StoryFn } from '@storybook/react';
import DateTimeInput from './DateTimeInput';

export default {
  title: 'Input/DateTimeInput',
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
        component: '날짜와 시간을 입력받는 컴포넌트입니다. 사용자가 날짜를 선택하고, 시간대를 지정할 수 있습니다.',
      },
    },
  },
  component: DateTimeInput,
  tags: ['autodocs'],
} as Meta<typeof DateTimeInput>;

const Template: StoryFn<typeof DateTimeInput> = (args) => <DateTimeInput {...args} />;

export const Default = Template.bind({});
Default.args = {
  dateTime: '3월 26일 (수) 18-20시',
  onChangeClick: () => alert('날짜 변경 버튼 클릭됨'),
};
