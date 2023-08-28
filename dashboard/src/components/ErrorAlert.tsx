import { AlertCircle } from 'lucide-react';

import { Alert, AlertDescription, AlertTitle } from './ui/alert';

type Props = {
  value: {
    message: string;
  };
  title?: string;
  className?: string;
};

export function ErrorAlert({ value, title = 'Error', className }: Props) {
  return (
    <div className="p-8">
      <Alert variant="destructive" className={className}>
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>{title}</AlertTitle>
        <AlertDescription>{value.message}</AlertDescription>
      </Alert>
    </div>
  );
}
