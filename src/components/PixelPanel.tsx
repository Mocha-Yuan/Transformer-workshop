import type { ReactNode } from 'react';

interface PixelPanelProps {
  children: ReactNode;
  className?: string;
}

export function PixelPanel({ children, className = '' }: PixelPanelProps) {
  return <section className={`pixel-panel ${className}`}>{children}</section>;
}
