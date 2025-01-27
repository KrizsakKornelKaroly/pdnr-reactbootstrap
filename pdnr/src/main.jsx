import React from 'react';
import * as ReactDOM from "react-dom/client";
import { Provider } from 'react-redux';
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import { store } from './store';
import App from './App.jsx';
import './index.css';
import { AuthProvider } from './providers/AuthProvider.jsx';
import { ProtectedRoute } from './components/ProtectedRoute.jsx';
import ErrorPage from './pages/ErrorPage.jsx';
import LoginPage from './pages/login/LoginPage.jsx';
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
    path: "/reset-password",
    element: <ResetPasswordPage />,
  },
  {
    path: "/request-password",
    element: <RequestPasswordPage />,
  },
  {
    path: "/duty",
    element: (
      <ProtectedRoute>
        <DutyPage />
      </ProtectedRoute>
    ),
  },
]);

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Provider store={store}>
      <AuthProvider>
        <RouterProvider router={router} />
      </AuthProvider>
    </Provider>
  </React.StrictMode>,
);