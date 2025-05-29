import type { Meta, StoryFn } from '@storybook/react';
import React from 'react';
import BookStepCalculationModal from './BookStepCalculationModal';

export default {
  title: 'Modal/BookStepPrice',
  component: BookStepCalculationModal,
  tags: ['autodocs'],
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
} as Meta<typeof BookStepCalculationModal>;

const Template: StoryFn<React.ComponentProps<typeof BookStepCalculationModal>> = (args) => (
  <BookStepCalculationModal {...args} />
);

export const DefaultPrice = Template.bind({});
DefaultPrice.args = {
  basicAmount: 17000,
  hours: 3,
  addPersonCount: 0,
  addAmountPerPerson: 0,
  baseTotal: 17000 * 3, // 추가
  addTotal: 0, // 추가
  finalTotal: 17000 * 3,
  onNext: () => alert('다음 단계로 이동'),
};

export const WithAddPrice = Template.bind({});
WithAddPrice.args = {
  basicAmount: 17000,
  hours: 3,
  addPersonCount: 4,
  addAmountPerPerson: 1000,
  baseTotal: 17000 * 3,
  addTotal: 1000 * 4,
  finalTotal: 17000 * 3 + 1000 * 4,
  onNext: () => alert('다음'),
};
