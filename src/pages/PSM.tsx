import { PageHeader } from '@/components/PageHeader';
import { PageContent } from '@/components/PageContent';
import { PSMStats } from '@/widgets/PSMStats';
import { PSMHistory } from '@/widgets/PSMHistory';
import { PSMMintedPoolBalancePie } from '@/widgets/PSMMintedPoolBalancePie';

export const PSM = () => (
  <>
    <PageHeader title="PSM" />
    <PageContent>
      <div className="grid gap-4 grid-cols-1 2xl:grid-cols-2">
        <div>
          <PSMStats />
        </div>
        <PSMMintedPoolBalancePie />
      </div>
      <PSMHistory />
    </PageContent>
  </>
);
