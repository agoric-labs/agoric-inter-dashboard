import React from 'react';
import { ValueCard } from './ValueCard';
import { ErrorAlert } from './ErrorAlert';
import { Skeleton } from './ui/skeleton';

interface DataStatusProps {
  isLoading: boolean;
  error: any;
  title: string;
}

const DataStatus: React.FC<DataStatusProps> = ({ isLoading, error, title }) => {
  if (isLoading) {
    return <ValueCard title={title} value={<Skeleton className="w-[120px] h-[32px] rounded-full" />} />;
  }

  if (error) {
    return <ErrorAlert value={error} />;
  }

  return null;
};

export default DataStatus;
