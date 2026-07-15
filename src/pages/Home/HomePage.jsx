import { useEffect } from 'react';
import HomeHero from './components/HomeHero';

const HomePage = () => {
  useEffect(() => {
    document.title = "Tate McRae | Home";
  })
  return (
    <>
      {/* Hero Section */}
      <HomeHero/>
      <div className="w-full min-h-screen bg-secondary"></div>
 
    </>
  )
}

export default HomePage