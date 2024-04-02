import { ReactNode } from 'react';

type Props = {
  children: ReactNode;
};

export const PageContent = ({ children }: Props) => <div className="p-8">{children}</div>;
