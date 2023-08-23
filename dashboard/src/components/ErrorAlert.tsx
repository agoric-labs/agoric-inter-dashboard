import { AlertCircle } from 'lucide-react';

import { Alert, AlertDescription, AlertTitle } from './ui/alert';

type Props = {
  value: {
    message: string;
  };
  title?: string;
};

export function ErrorAlert({ value, title = 'Error' }: Props) {
  return (
    <Alert variant="destructive">
      <AlertCircle className="h-4 w-4" />
      <AlertTitle>{title}</AlertTitle>
      <AlertDescription>{value.message}</AlertDescription>
    </Alert>
  );
}
