import { useLoaderData } from 'react-router-dom';
import { PageHeader } from '@/components/PageHeader';
import { PageContent } from '@/components/PageContent';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/card';
import { BarChart } from '@/components/BarChart';
import { ValueCard } from '@/components/ValueCard';
import { formatPrice } from '@/utils';

export const Reserve = () => {
  const data: any = useLoaderData();

  return (
    <>
      <PageHeader title="Reserve Assets" />
      <PageContent>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <ValueCard title="Total Reserve Assets" value={formatPrice(data.total_reserve_assets[0]?.value || 0)} />
          <ValueCard title="Reserve Shortfall" value={formatPrice(data.reserve_shortfall[0]?.value || 0)} />
        </div>
        <Card className="my-4 mb-4">
          <CardHeader>
            <CardTitle>History</CardTitle>
          </CardHeader>
          <CardContent>
            <BarChart data={data.reserve_assets} xKey="day" y2Key="brand" valueKey="avg_amount" />
          </CardContent>
        </Card>
      </PageContent>
    </>
  );
};
