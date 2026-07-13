import { Outlet } from 'react-router-dom'
import './App.scss'
import Navbar from './components/Navbar/Navbar'
function App() {
  return (
      <>
        <div className="slide font-unison text-primary">
          {/* Header Layout*/}
          <Navbar /> 
           {/* Page Layout*/}
          <main className="main-content">
            <Outlet /> 
          </main>
        </div>
      </>
  )
}

export default App