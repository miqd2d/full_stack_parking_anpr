// index.js
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import App from './App';
import RegisterScreen from './Pages/RegisterScreen';
import Admin from './Pages/Admin';
import Customer from './Pages/Customer';
import Stats from './Pages/Stats';
import UserDetail from './Pages/UserDetail';
import PasswordChange from './Pages/PasswordChange';
import Payment from './Pages/Payment';
import PrivateRoute from './Components/PrivateRoute';

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
  },
  {
    path: "/register",
    element: <RegisterScreen />,
  },
  {
    path: "/admin",
    element: (
      <PrivateRoute requiredType="admin">
        <Admin />
      </PrivateRoute>
    ),
  },
  {
    path: "/stat",
    element: (
      <PrivateRoute requiredType="admin">
        <Stats />
      </PrivateRoute>
    ),
  },
  {
    path: "/userdetails",
    element: (
      <PrivateRoute requiredType="admin">
        <UserDetail />
      </PrivateRoute>
    ),
  },
  {
    path: "/customer",
    element: (
      <PrivateRoute requiredType="customer">
        <Customer />
      </PrivateRoute>
    ),
  },{
    path: "/payment",
    element: (
      <PrivateRoute requiredType="customer">
        <Payment />
      </PrivateRoute>
    ),
  },{
    path: "/changepassword",
    element: (
      <PrivateRoute requiredType="customer">
        <PasswordChange />
      </PrivateRoute>
    ),
  },
]);

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>
);
