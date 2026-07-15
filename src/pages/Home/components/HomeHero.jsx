import heroBackground from '../../../assets/images/backgrounds/hero-background.webp'

const HomeHero = () => {
  return (
    <>
      <div 
        className="relative w-full min-h-screen py-24 flex flex-col justify-center bg-cover max-md:bg-right bg-center" 
        style={{ backgroundImage: `url(${heroBackground})` }}
      >
       

        <div className="absolute inset-0 bg-linear-to-t from-secondary via-secondary  to-transparent md:hidden pointer-events-none" />

        {/* horizontal line */}
        <div className="max-md:hidden absolute top-12 left-0 w-full h-px bg-linear-to-r from-white/20 to-transparent" />

        {/* horizontal line */}
        <div className="max-md:hidden absolute bottom-12 left-0 w-full h-px bg-linear-to-r from-white/20 to-transparent" />

        {/* vertical line */}
        <div className="absolute inset-y-0 left-[45%] -translate-x-1/2 w-full max-w-7xl pointer-events-none px-4 sm:px-6 lg:px-8">
          <div className="absolute top-0 bottom-0 left-4 sm:left-6 lg:left-8 w-px bg-white/20" />
        </div>

        
        <div className="relative w-full max-w-7xl mx-auto max-lg:px-4 max-md:px-6 z-10">
          <div className="max-md:w-full md:w-[50%]">
            <h1 className="max-md:text-4xl text-6xl font-bold text-primary">
              TATE MCRAE
            </h1>
            <p className="text-gray-300 md:w-[85%] mt-4">
              Step into the world of Tate McRae, where emotion and energy collide. Discover the voice redefining modern pop.
            </p>
          </div>
        </div>

      </div>
    </>
  )
}

export default HomeHero