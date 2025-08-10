import type { Meta, StoryObj } from '@storybook/react';
import ToastMessage from './ToastMessage';
import { useToastStore } from '../../store/toast/toastStore';
import { useEffect } from 'react';
import { ReservationToastMessages, ReservationToastKey } from './ToastMessageEnums';

const meta: Meta<typeof ToastMessage> = {
  title: 'Components/ToastMessage',
  component: ToastMessage,
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
};

export default meta;
type Story = StoryObj<typeof ToastMessage>;

/** ✅ 메시지 보여주는 스토리 생성 함수 */
const createToastStory = (key: ReservationToastKey): Story => ({
  render: () => {
    const Setup = () => {
      useEffect(() => {
        // auto-hide 막기
        useToastStore.setState({
          showToast: (message: string) => {
            useToastStore.setState({ message, isVisible: true });
          },
        });

        const { showToast } = useToastStore.getState();
        showToast(ReservationToastMessages[key]);
      }, []);

      return <ToastMessage />;
    };

    return <Setup />;
  },
});

/** ✅ 각 메시지 스토리 개별 export */
export const PastTime = createToastStory(ReservationToastKey.PAST_TIME);
export const TooLong = createToastStory(ReservationToastKey.TOO_LONG);
export const TooShort = createToastStory(ReservationToastKey.TOO_SHORT);
