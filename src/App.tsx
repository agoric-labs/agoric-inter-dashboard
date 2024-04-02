import { StrictMode, ReactNode } from 'react';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { CubeProvider } from '@/components/CubeProvider';
import { OraclePriceProvider } from '@/components/OraclePrices';

import { ErrorPage } from './pages/ErrorPage';
import { MainLayout } from './components/MainLayout';
import { Vaults } from './pages/Vaults';
import { InterProtocol } from './pages/InterProtocol';
import { PSM } from './pages/PSM';
import { Reserve } from './pages/Reserve';
import { DebugPage } from './pages/Debug';
import { Liquidated } from './pages/Liquidated';

const MainLayoutWithCoube = ({ children }: { children?: ReactNode }) => (
  <CubeProvider>
    <OraclePriceProvider>
      <MainLayout>{children}</MainLayout>
    </OraclePriceProvider>
  </CubeProvider>
);

const router = createBrowserRouter([
  {
    path: '/',
    element: <MainLayoutWithCoube />,
    errorElement: <ErrorPage />,

    children: [
      {
        path: '/',
        element: <InterProtocol />,
      },
      {
        path: '/psm',
        element: <PSM />,
      },
      {
        path: '/vaults',
        element: <Vaults />,
      },
      {
        path: '/reserve',
        element: <Reserve />,
      },
      {
        path: '/liquidated',
        element: <Liquidated />,
      },
      {
        path: '/__debug',
        element: <DebugPage />,
      },
    ],
  },
]);

export function App() {
  return (
    <StrictMode>
      <RouterProvider router={router} />
    </StrictMode>
  );
}
