import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'

// Layouts
import App from './App'
import PublicLayout from './layouts/PublicLayout'
import AdminLayout from './layouts/AdminLayout'

// Pages
import HomePage from './pages/Home/HomePage'
import NewsPage from './pages/News/NewsPage'
import AdminDashboard from './pages/Admin/AdminDashboard'
import PrivateRoute from './components/PrivateRoute'
import LoginPage from './pages/Login/LoginPage'
import AuthLayout from './layouts/AuthLayout'


const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      
      // 1. PUBLIC ROUTES
      {
        element: <PublicLayout />, 
        children: [
          {
            path: "/",
            element: <HomePage /> 
          },
          {
            path: "/news",
            element: <NewsPage /> ,
            
          }
        ]
      },

      // 2. AUTH ROUTES
      {
        element: <AuthLayout />,
        children: [
          { path: "/login", element: <LoginPage /> }
        ]
      },

      // 3. ADMIN PANEL ROUTES
      {
        
        element: <PrivateRoute />, 
        children: [
          {
            element: <AdminLayout />, 
            children: [
              { path: "/admin", element: <AdminDashboard /> } 
            ]
          }
        ]
      }
  
    ]
  }
])

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
)