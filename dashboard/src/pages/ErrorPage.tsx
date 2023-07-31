import { useRouteError } from 'react-router-dom';
import { PageHeader } from '@/components/PageHeader';
import { PageContent } from '@/components/PageContent';
import { MainLayout } from '@/components/MainLayout';

export function ErrorPage() {
  const error: any = useRouteError();

  return (
    <MainLayout>
      <PageHeader title="Oops!" />
      <PageContent>
        <p>Sorry, an unexpected error has occurred.</p>
        <p>
          <i>{error.statusText || error.message}</i>
        </p>
      </PageContent>
    </MainLayout>
  );
}
