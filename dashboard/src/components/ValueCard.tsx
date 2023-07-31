import { Card, CardHeader, CardContent, CardTitle } from '@/components/card';

type Props = {
  value: string;
  title: string;
  className?: string;
};

export const ValueCard = ({ value, className, title }: Props) => (
  <Card className={className}>
    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
      <CardTitle className="text-sm font-medium">{title}</CardTitle>
    </CardHeader>
    <CardContent>
      <div className="text-2xl font-bold">{value}</div>
      {/* <p className="text-xs text-muted-foreground">+20.1% from last month</p> */}
    </CardContent>
  </Card>
);
