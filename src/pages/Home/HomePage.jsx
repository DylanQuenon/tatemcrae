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
    </>
  )
}

export default HomePage