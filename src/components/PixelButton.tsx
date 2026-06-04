import type { ButtonHTMLAttributes, ReactNode } from 'react';

interface PixelButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
}

export function PixelButton({ children, ...props }: PixelButtonProps) {
  return (
    <button className="pixel-button" type="button" {...props}>
      {children}
    </button>
  );
}
