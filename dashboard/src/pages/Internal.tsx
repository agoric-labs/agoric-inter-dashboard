import { PageHeader } from '@/components/PageHeader';
import { PageContent } from '@/components/PageContent';
import { HeadTendermintDiffChart } from '@/widgets/HeadTendermintDiffChart';

export const Internal = () => (
  <>
    <PageHeader title="Internal Stats" />
    <PageContent>
      <HeadTendermintDiffChart />
    </PageContent>
  </>
);
