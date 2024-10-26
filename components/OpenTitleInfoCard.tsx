import React, { ReactNode } from 'react';

const OpenTitleInfoCard = ({ title, children, className }: { title: string, children: ReactNode, className?: string }) => {
  return (
    <div className='bg-black-10 rounded-md p-12 font-semibold text-lg border-[1px] border-black-15'>
      <p className={`text-gray-60 mb-4 ${className}`}>{title}</p>
      {children}
    </div>
  );
};

export default OpenTitleInfoCard;
