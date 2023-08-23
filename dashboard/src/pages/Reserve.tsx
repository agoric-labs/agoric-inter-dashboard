import { PageHeader } from '@/components/PageHeader';
import { PageContent } from '@/components/PageContent';
import { ReserveSummary } from '@/widgets/ReserveSummary';
import { ReserveHistory } from '@/widgets/ReserveHistory';

export const Reserve = () => (
  <>
    <PageHeader title="Reserve Assets" />
    <PageContent>
      <ReserveSummary />
      <ReserveHistory />
    </PageContent>
  </>
);
