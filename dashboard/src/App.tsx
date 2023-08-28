import { StrictMode, ReactNode } from 'react';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { CubeProvider } from '@/components/CubeProvider';

import { ErrorPage } from './pages/ErrorPage';
import { MainLayout } from './components/MainLayout';
import { Vaults } from './pages/Vaults';
import { InterProtocol } from './pages/InterProtocol';
import { PSM } from './pages/PSM';
import { Reserve } from './pages/Reserve';
import { Internal } from './pages/Internal';

const MainLayoutWithCoube = ({ children }: { children?: ReactNode }) => (
  <CubeProvider>
    <MainLayout>
      {children}
    </MainLayout>
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
        path: '/internal',
        element: <Internal />,
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
