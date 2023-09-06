import { PageHeader } from '@/components/PageHeader';
import { PageContent } from '@/components/PageContent';
import { ReserveSummary } from '@/widgets/ReserveSummary';
import { ReserveShortfall } from '@/widgets/ReserveShortfall';
import { ReserveHistory } from '@/widgets/ReserveHistory';

export const Reserve = () => (
  <>
    <PageHeader title="Reserve Assets" />
    <PageContent>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <ReserveSummary />
        <ReserveShortfall />
      </div>
      <ReserveHistory />
    </PageContent>
  </>
);
