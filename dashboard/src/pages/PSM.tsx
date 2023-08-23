import { PageHeader } from '@/components/PageHeader';
import { PageContent } from '@/components/PageContent';
import { PSMStats } from '@/widgets/PSMStats';
import { PSMHistory } from '@/widgets/PSMHistory';
import { PSMUtilizedPie } from '@/widgets/PSMUtilizedPie';
import { PSMMintedPoolBalancePie } from '@/widgets/PSMMintedPoolBalancePie';

export const PSM = () => (
  <>
    <PageHeader title="PSM" />
    <PageContent>
      <div className="grid grid-cols-1 2xl:grid-cols-2 gap-4">
        <PSMUtilizedPie />
        <PSMMintedPoolBalancePie />
      </div>
      <div className="mt-4" />
      <PSMStats />
      <PSMHistory />
    </PageContent>
  </>
);
