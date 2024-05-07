import { ErrorAlert } from './ErrorAlert';
import { PageHeader } from './PageHeader';
import { PageContent } from './PageContent';
import { ValueCardGrid } from './ValueCardGrid';
import { ValueCard } from './ValueCard';
import { Skeleton } from './ui/skeleton';
import { SectionHeader } from './SectionHeader';

interface InterProtocolSkeletonProps {
  error: any;
  isLoading: boolean;
}

const firstCards = [
  'IST in Circulation',
  'Total Mint Limit',
  'Total Mint Limit Utilized',
  'Total Interchain IST',
  '% of Interchain IST',
  'Smart Wallets Provisioned',
];

const InterProtocolSkeleton: React.FC<InterProtocolSkeletonProps> = ({ error, isLoading }) => {
  if (error) {
    return <ErrorAlert value={error} />;
  }

  if (isLoading) {
    return (
      <>
        <PageHeader title="Summary" />
        <PageContent>
          <ValueCardGrid>
            {firstCards.map((title) => (
              <ValueCard title={title} key={title} value={<Skeleton className="w-[100px] h-[32px] rounded-full" />} />
            ))}
          </ValueCardGrid>
          <SectionHeader>Balances</SectionHeader>
          <Skeleton className="w-full h-[20px] rounded-full mb-2" />
          <Skeleton className="w-full h-[20px] rounded-full mb-2" />
          <Skeleton className="w-full h/[20px] rounded-full mb-2" />
          <Skeleton className="w-full h-[20px] rounded-full mb-2" />
        </PageContent>
      </>
    );
  }

  return null;
};

export default InterProtocolSkeleton;
