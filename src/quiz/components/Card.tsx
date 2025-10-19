import React from 'react';

export default function Card({ children, className }: { children?: React.ReactNode; className?: string }) {
  return (
    <div className={`bg-white rounded-xl shadow-lg p-6 ${className || ''}`}>
      {children}
    </div>
  );
}
