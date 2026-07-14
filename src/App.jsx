import { Outlet } from 'react-router-dom'
import './App.scss'
import authAPI from './services/authAPI'
import AuthContext from './contexts/AuthContext';
import { useState } from 'react'
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css'

authAPI.setup()
function App() {
    const [isAuthenticated, setIsAuthenticated] = useState(authAPI.isAuthenticated())

  // on donne les infos à la forme de notre contexte
  const contextValue = {
    isAuthenticated: isAuthenticated,
    setIsAuthenticated: setIsAuthenticated
  }

 

  return (
      <AuthContext.Provider value={contextValue}>
        <Outlet /> 
        <ToastContainer 
          position="bottom-right"
          pauseOnHover
        />         
      </AuthContext.Provider>
  )
}

export default App