import { PageHeader } from '@/components/PageHeader';
import { PageContent } from '@/components/PageContent';
import { ReserveSummary } from '@/components/ReserveSummary';
import { ReserveHistory } from '@/components/ReserveHistory';

export const Reserve = () => (
  <>
    <PageHeader title="Reserve Assets" />
    <PageContent>
      <ReserveSummary />
      <ReserveHistory />
    </PageContent>
  </>
);
