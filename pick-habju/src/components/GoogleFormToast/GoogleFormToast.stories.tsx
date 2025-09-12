import type { Meta, StoryObj } from '@storybook/react';
import GoogleFormToast from './GoogleFormToast';
import { useGoogleFormToastStore } from '../../store/googleFormToast/googleFormToastStore';
import { useEffect } from 'react';

// 토스트를 보여주기 위한 래퍼 컴포넌트
const ToastWrapper = () => {
  useEffect(() => {
    // 스토리북에서 토스트를 보여주기 위해 강제로 표시
    const store = useGoogleFormToastStore.getState();
    store.showToast();
  }, []);

  return <GoogleFormToast />;
};

const meta: Meta<typeof ToastWrapper> = {
  title: 'Components/GoogleFormToast',
  component: ToastWrapper,
  parameters: {
    layout: 'fullscreen',
  },
};

export default meta;
type Story = StoryObj<typeof ToastWrapper>;

/**
 * 기본 Google Form 토스트입니다.
 * 클릭하면 구글 폼이 새 탭에서 열립니다.
 */
export const Default: Story = {};
