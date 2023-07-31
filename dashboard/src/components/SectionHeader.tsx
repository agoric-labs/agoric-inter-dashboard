import { ReactNode } from 'react';
import { cn } from '@/lib/utils';

type Props = {
  children: ReactNode;
  className?: string;
};

export const SectionHeader = ({ children, className }: Props) => (
  <h2 className={cn('text-2xl fontebold tracking-tight mb-5', className)}>{children}</h2>
);
