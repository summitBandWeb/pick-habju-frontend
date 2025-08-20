const Footer = () => {
  return (
    <div
      className="flex w-full max-w-[25.9375rem] h-[9.3125rem] pt-[1.25rem] pr-[2.03125rem] pb-[3.6875rem] pl-[2.03125rem] flex-col items-center bg-[#FFFBF0]"
      aria-label="사이트 푸터"
    >
      <div className="flex items-center text-gray-400 font-footer-button">
        {/* <span>
            <a
          href="https://twilight-utahraptor-df2.notion.site/24ab56bc00678022b173d901996f0b14"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="서비스 공지사항 (새 탭에서 열림)"
          className="ml-1 cursor-pointer hover:underline hover:text-blue-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 rounded-sm transition-colors"
        >공지사항</a> |</span> */}
        <span>
          <a
          href="https://forms.gle/uea6mtKQSBoAN7fs6"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="서비스 피드백하기 (새 탭에서 열림)"
          className="ml-1 cursor-pointer hover:underline hover:text-blue-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 rounded-sm transition-colors"
        >
          서비스 피드백하기
        </a> |</span>
        <span>
          &nbsp;
          <a
            href="mailto:pickhabju@gmail.com"
            className="cursor-pointer hover:underline hover:text-blue-500 transition-colors"
            aria-label="이메일 보내기"
          >
            이메일 pickhabju@gmail.com
          </a>
        </span>
      </div>

      <div className="flex justify-center items-center gap-[0.625rem] px-[0.625rem] py-[0.25rem]">
        <span className="text-gray-400 font-footer-copyright">
          Copyright 2025. PICKHAPJU Co. All rights reserved.
        </span>
      </div>
    </div>
  );
};

export default Footer;
