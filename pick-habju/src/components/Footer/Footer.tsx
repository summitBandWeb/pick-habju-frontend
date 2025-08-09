const Footer = () => {
  return (
    <div
      className="flex w-[25.125rem] h-[9.3125rem] pt-[1.25rem] pr-[2.03125rem] pb-[3.6875rem] pl-[2.03125rem] flex-col items-center"
      aria-label="사이트 푸터"
    >
      <div className="flex items-center text-gray-400 font-footer-button">
        <span>공지사항 |</span>
        <span>&nbsp;서비스 피드백하기 |</span>
        <span>&nbsp;이메일 pickhabju@gmail.com</span>
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
