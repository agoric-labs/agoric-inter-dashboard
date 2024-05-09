import { ErrorAlert } from './ErrorAlert';
import { Skeleton } from './ui/skeleton';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';

interface ChartsSkeletonInterface {
  error: any;
  isLoading: boolean;
  title: string;
}

const ChartsSkeleton: React.FC<ChartsSkeletonInterface> = ({ error, isLoading, title }) => {
  if (error) {
    return <ErrorAlert value={error} />;
  }

  if (isLoading) {
    return (
      <Card className="my-4 mb-4">
        <CardHeader>
          <CardTitle>{title}</CardTitle>
        </CardHeader>
        <CardContent>
          <Skeleton className="w-full h-[20px] rounded-full mb-2" />
          <Skeleton className="w-full h-[20px] rounded-full mb-2" />
          <Skeleton className="w-full h-[20px] rounded-full mb-2" />
          <Skeleton className="w-full h-[20px] rounded-full mb-2" />
        </CardContent>
      </Card>
    );
  }

  return null;
};

export default ChartsSkeleton;
