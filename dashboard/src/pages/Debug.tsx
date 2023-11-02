import { useEffect, useState } from 'react';
import { useCubeQuery } from '@cubejs-client/react';
import { ErrorAlert } from '@/components/ErrorAlert';
import { ValueCard } from '@/components/ValueCard';
import { ValueCardGrid } from '@/components/ValueCardGrid';
import { PageHeader } from '@/components/PageHeader';
import { PageContent } from '@/components/PageContent';

function Timer() {
  const [s, setS] = useState(0);

  useEffect(() => {
    const t = setInterval(() => {
      setS(v => v + 1);
    }, 1000);

    return () => clearInterval(t);
  }, []);

  return <ValueCard title="Last Refresh" value={`${s}s ago`} />;
}

export function DebugPage() {
  const res = useCubeQuery(
    {
      measures: ['blocks.block_height_max'],
      timeDimensions: [
        {
          dimension: 'blocks.block_time',
          granularity: 'day',
          dateRange: 'Today',
        },
      ],
    },
    {
      subscribe: true,
    },
  );

  if (res.isLoading) {
    return <div>Loading...</div>;
  }

  if (res.error) {
    return <ErrorAlert value={res.error} />;
  }

  if (!res.resultSet) {
    return null;
  }

  const rows = res.resultSet.tablePivot();

  if (rows.length === 0) {
    return null;
  }

  const lastHeight = rows[0]['blocks.block_height_max'] as number;

  return (
    <>
      <PageHeader title="Debug" />
      <PageContent>
        <ValueCardGrid>
          <ValueCard title="Last Block Height" value={lastHeight} />
          <Timer key={lastHeight} />
        </ValueCardGrid>
      </PageContent>
    </>
  );
}
