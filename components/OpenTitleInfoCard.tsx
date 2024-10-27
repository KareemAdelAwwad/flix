import React, { ReactNode } from 'react';

const OpenTitleInfoCard = ({ title, children, className }: { title: string, children: ReactNode, className?: string }) => {
  return (
    <div className='relative dark:bg-black-10 bg-gray-95 rounded-lg p-12 font-semibold text-lg borders'>
      <div>
      <p className={`dark:text-gray-60 mb-4 ${className}`}>{title}</p>
      </div>
      {children}
    </div>
  );
};

export default OpenTitleInfoCard;
