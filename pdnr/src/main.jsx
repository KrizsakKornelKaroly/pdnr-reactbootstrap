import React from 'react'
import * as ReactDOM from "react-dom/client";
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import App from './App.jsx'
import './index.css'
import { AuthProvider } from './context/AuthContext';
import ErrorPage from './pages/ErrorPage.jsx';
import LoginPage from './pages/login/LoginPage.jsx';
import ProtectedPage from './pages/ProtectedPage.jsx';

const router = createBrowserRouter([
  {
    path: "/",
    element: <App/>,
    errorElement: <ErrorPage />,
  },
  {
    path: "/belepes",
    element: <LoginPage/>,
  },
  {
    path: "/test",
    element: <ProtectedPage />
  }
]);

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <AuthProvider>
      <RouterProvider router={router} />
    </AuthProvider>
  </React.StrictMode>,
)
