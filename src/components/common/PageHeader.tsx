// components/common/PageHeader.tsx
import React from 'react';

type PageHeaderProps = {
  title: string;
  className?: string;           // optional: add extra classes if needed
};

export default function PageHeader({ title, className = '' }: PageHeaderProps) {
  return (
    <h1
      className={`
        mb-8 md:mb-6  py-3
        text-4xl sm:text-5xl md:text-[49px] 
        font-bold 
        text-[#000000] 
        tracking-tight
        ${className}
      `}
    >
      {title}
    </h1>
  );
}