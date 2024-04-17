import { ReactNode } from 'react';
import { Card, CardHeader, CardContent, CardTitle } from './ui/card';

type Props = {
  value: string | ReactNode;
  title: string;
  className?: string;
  testId?: string;
};

export const ValueCard = ({ value, className, title, testId }: Props) => (
  <Card className={className}>
    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
      <CardTitle className="text-sm font-medium">{title}</CardTitle>
    </CardHeader>
    <CardContent>
      <div data-testid={testId} className="text-2xl font-bold">
        {value}
      </div>
      {/* <p className="text-xs text-muted-foreground">+20.1% from last month</p> */}
    </CardContent>
  </Card>
);
