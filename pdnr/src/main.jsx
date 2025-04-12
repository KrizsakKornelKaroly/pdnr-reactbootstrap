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
import { lazy, Suspense } from 'react';
import LoadingSpinner from './components/LoadingSpinner.jsx';

// Lazy load page components
const DutyPage = lazy(() => import('./pages/duty/DutyPage.jsx'));
const LoginPage = lazy(() => import('./pages/login/LoginPage.jsx'));
const RegistrationPage = lazy(() => import('./pages/register/RegistrationPage.jsx'));
const ResetPasswordPage = lazy(() => import('./pages/reset-password/ResetPasswordPage.jsx'));
const RequestPasswordPage = lazy(() => import('./pages/request-password/RequestPasswordPage.jsx'));

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    errorElement: <ErrorPage />,
  },
  {
    path: "/belepes",
    element: (
      <Suspense fallback={<LoadingSpinner fullScreen />}>
        <LoginPage />
      </Suspense>
    ),
  },
  {
    path: "/regisztracio",
    element: (
      <Suspense fallback={<LoadingSpinner fullScreen />}>
        <RegistrationPage />
      </Suspense>
    ),
  },
  {
    path: "/reset-password",
    element: (
      <Suspense fallback={<LoadingSpinner fullScreen />}>
        <ResetPasswordPage />
      </Suspense>
    ),
  },
  {
    path: "/request-password",
    element: (
      <Suspense fallback={<LoadingSpinner fullScreen />}>
        <RequestPasswordPage />
      </Suspense>
    ),
  },
  {
    path: "/duty",
    element: (
      <ProtectedRoute>
        <Suspense fallback={<LoadingSpinner fullScreen />}>
          <DutyPage />
        </Suspense>
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