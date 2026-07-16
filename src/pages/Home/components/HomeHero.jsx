import { Headphones, MoveRight } from 'lucide-react'
import heroBackground from '../../../assets/images/backgrounds/hero-background.webp'
import { Fragment } from 'react'
import cardTest from '../../../assets/images/cardtest.jpg'
import test1 from '../../../assets/images/test1.jpg'
import test2 from '../../../assets/images/test2.png'
import test3 from '../../../assets/images/test3.jpg'
import test4 from '../../../assets/images/test4.webp'

const HomeHero = () => {
  const listeners = [test1, test2, test3, test4];
  const platforms = ["Spotify", "Youtube", "SoundCloud"];
  // platform row
  const platformRow = (
  <div className="md:w-[80%] flex items-center text-primary/20 text-xs justify-between">
    {platforms.map((platform) => (
      <Fragment key={platform}>
        <MoveRight />
        <p>{platform}</p>
      </Fragment>
    ))}
  </div>
);
  return (
    <>
      <div 
        className="relative w-full min-h-screen bg-fixed py-24 flex flex-col justify-center bg-cover max-md:bg-right bg-center" 
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
    
        {/* Jumbotron Home */}
        <div className="relative w-full max-w-7xl mx-auto max-lg:px-4 max-md:px-6 z-10">
          <div className="max-md:w-full md:max-w-2xl flex flex-col gap-10">
            {/* Jumbotron Title & Text*/}
            <div className="flex flex-col gap-5">
              <div className="flex flex-col gap-5">
                <h6 className="max-md:text-lg text-2xl text-primary"> SO CLOSE TO WHAT ???</h6> {/* /!\ LAST ALBUM */}
                <h1 className="max-md:text-4xl text-6xl font-bold text-primary">
                  TATE MCRAE
                </h1>
              </div>
              <p className="text-gray-300 md:w-[85%] mt-4">
                Step into the world of Tate McRae, where emotion and energy collide. Discover the voice redefining modern pop.
              </p>

            </div>
            {/*Jumbotron Stats */}
            <div className="flex flex-col gap-3">
              {/*platform-sequence */}
              {platformRow}
              {/*monthly listeners & random image */}
              <div className="flex flex-wrap relative gap-5 items-stretch text-primary">
                {/*Monthly Listeners (Integrate via API later?)*/}
                <div className="p-7 border border-primary rounded-3xl bg-[#121928] w-full md:max-w-sm flex flex-col gap-5">
                  <div className="flex gap-3 items-center text-primary/80 text-sm">
                    <Headphones />
                    <p>Listeners per month</p>
                  </div>
                  <div className="flex justify-between w-full items-center">
                    <p className="text-4xl font-bold">+42M</p>
                    <div className="flex items-center -space-x-3">
                        {listeners.map((item, index) => (
                            <div
                                key={item}
                                className={` flex h-12 bg-cover bg-center w-12 items-center justify-center rounded-full border border-primary bg-secondary`}
                                style={{
                                    zIndex: listeners.length - index,
                                    backgroundImage: `url(${item})`
                                }}
                            />
                        ))}
                    </div>
                    
                  </div>
                  
                </div>
                {/* /!\ Random Image from the gallery*/}
                <div className="max-md:h-40 w-full md:w-52 self-stretch bg-secondary border border-primary rounded-3xl bg-cover bg-center max-md:bg-bottom" style={{ backgroundImage: `url(${cardTest})` }}></div>
              </div>
              {platformRow}
            </div>
          </div>
        </div>

      </div>
    </>
  )
}

export default HomeHero