import { useEffect } from 'react';
import heroBackground from '../../assets/images/backgrounds/hero-background.webp'
const HomePage = () => {
  useEffect(() => {
    document.title = "Tate McRae | Home";
  })
  return (
    <>
   <div className="w-full min-h-screen py-24 bg-cover sm:bg-right lg:bg-center " style={{ backgroundImage: `url(${heroBackground})` }}>

   </div>
   <div className="w-full min-h-screen py-24 bg-cover bg-center " style={{ backgroundImage: `url(${heroBackground})` }}>

   </div>
    </>
  )
}

export default HomePage