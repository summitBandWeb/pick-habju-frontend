import type { Meta, StoryObj } from '@storybook/react';
import MapLoadingSkeleton from './MapLoadingSkeleton';

const meta: Meta<typeof MapLoadingSkeleton> = {
  title: 'Components/Map/MapLoadingSkeleton',
  component: MapLoadingSkeleton,
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
  },
  decorators: [
    (Story) => (
      <div className="relative w-full h-screen">
        {/* 지도 배경 목업 */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-100 via-green-50 to-yellow-50">
          <div className="flex items-center justify-center h-full text-gray-400 text-lg">
            지도 영역 (Map Area)
          </div>
        </div>
        <Story />
      </div>
    ),
  ],
};

export default meta;

type Story = StoryObj<typeof MapLoadingSkeleton>;

export const Default: Story = {
  name: '기본',
};
