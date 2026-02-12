import { useState } from 'react';
import noteIcon from '../../assets/svg/noteIcon.svg';

const TIP_MESSAGES = [
  '딱 맞는 시간이 없다면 일부만 예약하는 방법도 있어요',
  '지도를 옮겨 새로운 합주실을 찾아보세요',
  '즐겨찾기로 자주 가는 곳을 더 빠르게 찾아보세요',
  '합주실 이름을 검색해 빠르게 예약해보세요',
  '지도를 축소해 넓은 지역을 한눈에 보세요',
] as const;

const MapLoadingSkeleton = () => {
  const [tipMessage] = useState(() => 
    TIP_MESSAGES[Math.floor(Math.random() * TIP_MESSAGES.length)]
  );

  return (
    <div 
      className="absolute inset-0 backdrop-blur-[2.5px] bg-white/20 z-50"
      data-testid="map-loading-skeleton"
    >
      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center gap-2.5 w-[329px]">
        {/* 음표 로딩 애니메이션 */}
        <div className="flex items-end justify-between w-[70px] h-14">
          <img 
            src={noteIcon} 
            alt="" 
            className="w-[23.64px] h-10 animate-note-bounce"
            style={{ animationDelay: '0s' }}
          />
          <img 
            src={noteIcon} 
            alt="" 
            className="w-[23.64px] h-10 animate-note-bounce"
            style={{ animationDelay: '0.2s' }}
          />
          <img 
            src={noteIcon} 
            alt="" 
            className="w-[23.64px] h-10 animate-note-bounce"
            style={{ animationDelay: '0.4s' }}
          />
        </div>

        {/* 로딩 텍스트 및 도움말 */}
        <div className="flex flex-col gap-[13px] items-start w-full">
          {/* Loading ... */}
          <div className="flex items-center justify-center px-2.5 py-[5px] w-full">
            <p className="font-card-info text-gray-400">
              Loading ...
            </p>
          </div>

          {/* 도움말 메시지 */}
          <div className="flex flex-wrap items-center justify-center px-2.5 py-[5px] w-full">
            <p className="font-modal-default text-primary-black text-center whitespace-pre-wrap">
              {tipMessage}
            </p>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes note-bounce {
          0%, 100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-16px);
          }
        }

        .animate-note-bounce {
          animation: note-bounce 1.2s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
};

export default MapLoadingSkeleton;
