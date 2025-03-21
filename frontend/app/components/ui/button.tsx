// components/ui/button.tsx
import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  className?: string;
}

export const Button: React.FC<ButtonProps> = ({ children, className = '', ...props }) => {
  return (
    <button
      {...props}
      className={`bg-blue-600 text-white py-2 px-4 rounded-xl hover:bg-blue-700 transition ${className}`}
    >
      {children}
    </button>
  );
};
