import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { ErrorPage } from './pages/ErrorPage';
import { MainLayout } from './components/MainLayout';
import { Vaults } from './pages/Vaults';
import { InterProtocol } from './pages/InterProtocol';
import { PSM } from './pages/PSM';
import { Reserve } from './pages/Reserve';

// @ts-ignore
const dataBaseUrl = import.meta.env.VITE_DATA_BASE_URL || '/data';

export const loader = ({ request }: any) => {
  const url = new URL(request.url);
  const chain = url.searchParams.get('chain') || 'mainnet';
  const range = url.searchParams.get('range') || 'day';

  return fetch(`${dataBaseUrl}/${chain}-${range}.json`).then((r) => r.json());
};

const router = createBrowserRouter([
  {
    path: '/',
    element: <MainLayout />,
    errorElement: <ErrorPage />,

    children: [
      {
        path: '/',
        element: <InterProtocol />,
        loader,
      },
      {
        path: '/psm',
        element: <PSM />,
        loader,
      },
      {
        path: '/vaults',
        element: <Vaults />,
      },
      {
        path: '/reserve',
        element: <Reserve />,
        loader,
      },
    ],
  },
]);

export function App() {
  return <RouterProvider router={router} />;
}
