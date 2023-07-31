import { ReactNode } from 'react';

type Props = {
  children?: ReactNode;
};

export const ValueCardGrid = ({ children }: Props) => (
  <div className="grid grid-cols-2 xl:grid-cols-3 gap-4 mb-5">{children}</div>
);
