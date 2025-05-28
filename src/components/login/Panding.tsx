import React from 'react';

interface PandingProps {}

const Panding: React.FC<PandingProps> = () => {
  return (
    <div className='w-screen h-screen inset-0 bg-black/60 z-[9999008899] flex items-center justify-center'>
      <div className="w-16 h-16 border-4 border-t-transparent border-white rounded-full animate-spin"></div>
    </div>
  );
};

export default Panding;
