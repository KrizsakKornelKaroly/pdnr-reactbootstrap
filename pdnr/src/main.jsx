import React from 'react';
import * as ReactDOM from "react-dom/client";
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import App from './App.jsx';
import './index.css';
import { AuthProvider } from './context/AuthContext';
import ErrorPage from './pages/ErrorPage.jsx';
import LoginPage from './pages/login/LoginPage.jsx';
import ProtectedPage from './pages/ProtectedPage.jsx';
import RequestPasswordPage from './pages/request-password/RequestPasswordPage.jsx';
import ResetPasswordPage from './pages/reset-password/ResetPasswordPage.jsx';
import DutyPage from './pages/duty/DutyPage.jsx';
import RegistrationPage from './pages/register/RegistrationPage.jsx';

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    errorElement: <ErrorPage />,
  },
  {
    path: "/belepes",
    element: <LoginPage />,
  },
  {
    path: "/regisztracio",
    element: <RegistrationPage />,
  },
  {
    path: "/test",
    element: (
      <ProtectedPage element={<ProtectedPage />} />
    ), // Protect this route
  },
  {
    path: "/reset-password",
    element: <ResetPasswordPage />,
  },
  {
    path: "/request-password",
    element: <RequestPasswordPage />,
  },
  {
    path: "/duty",
    element: <DutyPage />,
  },
]);

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <AuthProvider>
      <RouterProvider router={router} />
    </AuthProvider>
  </React.StrictMode>,
);
