import { useEffect } from 'react';
import HomeHero from './components/HomeHero';
import HomeMarquee from './components/HomeMarquee';
import HomeTour from './components/HomeTour';
import HomeAlbums from './components/HomeAlbums';
import cardTest from '../../assets/images/cardtest.jpg'


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
      {/* Tour Section */}
      <HomeTour/>
      <div 
        className="w-full h-[300px] max-md:h-[150px] bg-cover border-b-1 border-t-1 border-primary/30" 
        style={{ backgroundImage: `url(${cardTest})`, backgroundPosition: "center 80%" }}
      >
         <h2 className="max-w-7xl mx-auto py-24 text-6xl max-lg:text-4xl max-md:text-3xl font-medium uppercase italic leading-none bg-tertiary bg-clip-text text-transparent max-md:px-4">
              Albums
          </h2>
      </div>
      {/* Albums Section */}
      <HomeAlbums/>
      
    </>
  )
}

export default HomePage