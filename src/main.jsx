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
import AdminTagsPage from './pages/Admin/Tags/AdminTagsPage'
import AdminTagPage from './pages/Admin/Tags/AdminTagPage'
import AdminAlbumsPage from './pages/Admin/Albums/AdminAlbumsPage'
import AdminAlbumPage from './pages/Admin/Albums/AdminAlbumPage'
import AdminNewsPage from './pages/Admin/News/AdminNewsPage'


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
              { path: "/admin", element: <AdminDashboard /> },
              { path: "/admin/tags", element: <AdminTagsPage /> },
              { path:"/admin/tags/:id", element: <AdminTagPage /> },
              { path:"/admin/albums/", element: <AdminAlbumsPage /> },
              { path:"/admin/albums/:id", element: <AdminAlbumPage /> },
              { path: "/admin/news/", element: <AdminNewsPage /> }
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