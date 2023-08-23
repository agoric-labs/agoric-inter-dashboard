import { useLoaderData } from 'react-router-dom';
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip } from 'recharts';
import { PageHeader } from '@/components/PageHeader';
import { PageContent } from '@/components/PageContent';
import { ValueCardGrid } from '@/components/ValueCardGrid';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { PSMStats } from '@/components/PSMStats';
import { BarChart } from '@/components/BarChart';
import { RadianTooltip } from '@/components/RadianTooltip';
import { colors } from '@/components/palette';

export const PSM = () => {
  const data: any = useLoaderData();
  const highStats = data.psm_stats
    .filter((s: any) => s.minted_pool_balance > 0)
    .map((s: any) => ({ ...s, utilizedPercent: s.utilized * 100 }));

  return (
    <>
      <PageHeader title="PSM" />
      <PageContent>
        <div className="grid grid-cols-1 2xl:grid-cols-2 gap-4">
          <Card>
            <CardHeader>
              <CardTitle>IST Utilization Per Anchor</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="w-full h-[400px]">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart width={800} height={400}>
                    <Pie
                      dataKey="utilizedPercent"
                      data={highStats}
                      innerRadius={70}
                      outerRadius={100}
                      fill="green"
                      nameKey="label"
                      paddingAngle={3}
                      minAngle={15}
                      labelLine={false}
                      label={RadianTooltip}
                    >
                      {highStats.map((s: any, idx: number) => (
                        <Cell fill={colors[idx % colors.length]} key={s.coin} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Total Minted IST Per Anchor</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="w-full h-[400px]">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart width={800} height={400}>
                    <Pie
                      dataKey="minted_pool_balance"
                      data={highStats}
                      innerRadius={70}
                      outerRadius={100}
                      fill="green"
                      nameKey="label"
                      paddingAngle={3}
                      minAngle={15}
                      labelLine={false}
                      label={RadianTooltip}
                    >
                      {highStats.map((s: any, idx: number) => (
                        <Cell fill={colors[idx % colors.length]} key={s.coin} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </div>
        <div className="mt-4" />
        <ValueCardGrid>
          {data.psm_stats.map((s: any) => (
            <PSMStats data={s} key={s.coin} />
          ))}
        </ValueCardGrid>
        <Card className="my-4 mb-4">
          <CardHeader>
            <CardTitle>Total Minted IST</CardTitle>
          </CardHeader>
          <CardContent>
            <BarChart data={data.psm_daily} xKey="date" y2Key="brand" valueKey="avg_total_minted_provided" />
          </CardContent>
        </Card>
      </PageContent>
    </>
  );
};
