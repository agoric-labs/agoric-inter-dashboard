import { StrictMode } from 'react';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import cubejs from '@cubejs-client/core';
import { CubeProvider } from '@cubejs-client/react';

import { ErrorPage } from './pages/ErrorPage';
import { MainLayout } from './components/MainLayout';
import { Vaults } from './pages/Vaults';
import { InterProtocol } from './pages/InterProtocol';
import { PSM } from './pages/PSM';
import { Reserve } from './pages/Reserve';
import { Internal } from './pages/Internal';

const devToken =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpYXQiOjE2OTI3MzM4ODN9.ziFC61eELOABmVzfLgC8cjVDG5fzuQ_w4_iCJ-INWWU';

// @ts-ignore
const accessToken = import.meta.env.VITE_ACCESS_TOKEN || devToken;

const cubejsApi = cubejs(accessToken, { apiUrl: '/cubejs-api/v1' });

const router = createBrowserRouter([
  {
    path: '/',
    element: <MainLayout />,
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
      <CubeProvider cubejsApi={cubejsApi}>
        <RouterProvider router={router} />
      </CubeProvider>
    </StrictMode>
  );
}
