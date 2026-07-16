import { useEffect } from 'react';
import HomeHero from './components/HomeHero';
import HomeMarquee from './components/HomeMarquee';


const HomePage = () => {
  useEffect(() => {
    document.title = "Tate McRae | Home";
  })
  return (
    <>
      {/* Hero Section */}
      <HomeHero/>
      <div className=" translate-y-[-50%] z-10">
        <HomeMarquee/>
      </div>
    
      
    </>
  )
}

export default HomePage