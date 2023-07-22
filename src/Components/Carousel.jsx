import React, { useCallback, useEffect, useState } from 'react'

const images = [
  '/Index/images/2.png',
  '/Index/images/3.png',
  '/Index/images/4.png',
  '/Index/images/5.png',
  '/Index/images/6.png',
  '/Index/images/7.png',
  '/Index/images/8.png',

]
export default function Carousel() {
  const [count, setCount] = useState(0);

  useEffect(() => {
    const intervalId = setInterval(() => {
      // update the count state every 1 second 
      
        setImage(prevCount => prevCount + 1);
      
      
    }, 5000);

    // return a cleanup function to clear the interval
    return () => clearInterval(intervalId);
  }, []);
    


    const [image,setImage] = useState(0)
    const[active,setActive] = useState(0)



    useEffect(() => {
      if(image >= 6 ) {
        setImage(0)
      }

      setActive(image)
  },[image])



    const handleRight = useCallback(() => {
      const i = image
      console.log("I\t",i, images.length-1)
      if(i==(images.length-1)) {
        setImage (0)
        setActive(0)

      } else {
        setImage(i+1)
        setActive(i+1)

      }

    },[image,active])

    const handleLeft = () => {
      const i = image
      if (i==0) {
        setImage(images.length-1)
        setActive(images.length-1)

      } else {
        setImage(i-1)
        setActive(i-1)

      }
    }
    
    useEffect(() => {
     // console.log("Image Index\t:\t",image)
    },[image])

  return (
    <>

<div className="flex w-full col-span-12 flex-row px-16 justify-around items-center">

      <div className='flex-1 flex flex-row justify-start  items-center mr-8'>
          <span onClick={handleLeft} className=' cursor-pointer'>{"<"}</span>
      </div>

      <img src={images[image]} className='w-full  mx-auto max-w-[800px]' />

      <div className='flex-1  flex flex-row justify-end items-center ml-8'>
          <span onClick={handleRight} className=' cursor-pointer'>{">"}</span>
      </div>

</div>

    <div className='col-start-2 col-span-10 gap-4 flex flex-row justify-center items-center'>

    {
        images.map((e,i)  =>  <a className={ active == i ?'p-2  cursor-pointer  bg-main rounded-full' :  'p-2 cursor-pointer  bg-white rounded-full' } /> )
    }


    </div>

    </>
  )
}
