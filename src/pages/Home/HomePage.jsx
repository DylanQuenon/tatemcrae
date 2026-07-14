import { useEffect } from 'react';
const HomePage = () => {
  useEffect(() => {
    document.title = "Tate McRae | Home";
  })
  return (
    <>
      <div className="text-primary py-24">
        <div className="mx-auto max-w-7xl px-6">
          Hey hey Everybody
        </div>
      </div>
    </>
  )
}

export default HomePage