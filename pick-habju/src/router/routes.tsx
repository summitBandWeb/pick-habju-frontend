import { createBrowserRouter, RouterProvider, Outlet, Navigate } from 'react-router-dom';
import RoutePaths from './routePaths';
import HomePage from '../pages/HomePage';
import MapPage from '../pages/MapPage';
import AppWrapper from '../layout/AppWrapper';

const RootLayout = () => (
  <AppWrapper>
    <Outlet />
  </AppWrapper>
);

const router = createBrowserRouter([
  {
    path: '/',
    element: <RootLayout />,
    children: [
      { index: true, element: <HomePage /> },
      { path: RoutePaths.MAP, element: <MapPage /> },
      { path: '*', element: <Navigate to={RoutePaths.HOME} replace /> },
    ],
  },
]);

const Router = () => {
  return <RouterProvider router={router} />;
};

export default Router;
