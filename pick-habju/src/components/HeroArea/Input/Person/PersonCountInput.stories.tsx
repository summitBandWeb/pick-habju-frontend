import type { Meta, StoryFn } from '@storybook/react';
import PersonCountInput from './PersonCountInput';

export default {
  title: 'Input/PersonCountInput',
  component: PersonCountInput,
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
          '인원 수를 입력받는 컴포넌트입니다. 사용자가 인원 수를 조정할 수 있으며, 변경 버튼을 통해 인원 수를 업데이트할 수 있습니다.',
      },
    },
  },
  tags: ['autodocs'],
} as Meta<typeof PersonCountInput>;

const Template: StoryFn<typeof PersonCountInput> = (args) => <PersonCountInput {...args} />;

export const Default = Template.bind({});
Default.args = {
  count: 7,
  onChangeClick: () => alert('인원 변경 버튼 클릭됨'),
};
