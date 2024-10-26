import React, { ReactNode } from 'react';

const OpenTitleInfoCard = ({ title, children }: { title: string, children: ReactNode }) => {
  return (
    <div className='bg-black-10 rounded-md p-12 font-semibold text-lg'>
      <p className='text-gray-60 mb-4'>{title}</p>
      {children}
    </div>
  );
};

export default OpenTitleInfoCard;
