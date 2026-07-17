import { useEffect } from 'react';
import HomeHero from './components/HomeHero';
import HomeMarquee from './components/HomeMarquee';
import HomeTour from './components/HomeTour';


const HomePage = () => {
  useEffect(() => {
    document.title = "Tate McRae | Home";
  })
  return (
    <>
      {/* Hero Section */}
      <HomeHero/>
      <div className="relative">
        <div className="absolute z-10 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
        <HomeMarquee/>

        </div>

      </div>
    
      <HomeTour/>
      
    </>
  )
}

export default HomePage