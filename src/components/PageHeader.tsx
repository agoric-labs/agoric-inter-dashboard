import { Helmet } from 'react-helmet';

type Props = {
  title: string;
};

export const PageHeader = ({ title }: Props) => (
  <h1 className="flex items-center space-x-4 lg:space-x-6 border-b p-8 text-3xl font-bold tracking-tight">
    <Helmet>
      <title>{title}</title>
    </Helmet>
    {title}
  </h1>
);
