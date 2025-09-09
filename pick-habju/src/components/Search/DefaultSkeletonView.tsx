const DefaultSkeletonView = () => {
  const skeletonCount = 6;
  return (
    <div className="w-full flex flex-col items-center gap-4 py-4 bg-[#FFFBF0]">
      {Array.from({ length: skeletonCount }).map((_, i) => (
        <div key={i} className="w-92.5 h-65 rounded-xl bg-gray-200 animate-pulse" />
      ))}
    </div>
  );
};

export default DefaultSkeletonView;
