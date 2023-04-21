import React, { useState , useRef, useEffect} from 'react';
import { Stage, Layer, Image, Group, Transformer } from 'react-konva';

function App({
  fg,
  bg,
  setGenratedImage
}) {
  const [selectedId, setSelectedId] = useState(null);
  const [image, setImage] = useState(null);
  const [bgImage,setBgImage] = useState(null)
  const imageRef = useRef(null);
  const trRef = useRef(null);
  const ref = useRef(null)
  const handleSelect = () => {
      trRef.current.nodes([imageRef.current]);
      trRef.current.getLayer().batchDraw();
      console.log('Called')
    
  };


  const handleImageUpload = (event) => {
    const uploadedImage = event.target.files[0];
    const reader = new FileReader();
    reader.onload = () => {
      const img = new window.Image()
      img.src = reader.result
      setImage(img);
    };
    reader.readAsDataURL(uploadedImage);
  };

  useEffect(() => {

    if(fg && bg) {

        const img = new window.Image()
        img.src = fg
        img.crossOrigin="anonymous"
        setImage(img)


    

    console.log("Image \t",img)

    const imgBg = new window.Image()
    imgBg.src = bg
    imgBg.crossOrigin="anonymous"
    setBgImage(imgBg)
    console.log("Image \t",imgBg  )
  }

  },[fg,bg])

  const handleSave = () => {
    // remove transformer from stage before saving
    trRef.current.detach();
    try {

    // get the stage as image data url
    const stageDataUrl = ref.current.toDataURL();
    setGenratedImage(stageDataUrl)

    console.log(stageDataUrl.toDataURL());
  } catch (e) {
    console.error(e); // Log any errors to the console
  }
    // add transformer back to stage
    trRef.current.attachTo( trRef.current.getStage());
    
    // use stage data url as needed
  };

  return (
    <div className='flex flex-col items-center '>
      <h1 className='my-2 mx-4'> IMAGE EDITOR </h1>
      <div className='flex flex-row justify-between items-center '>
         <button className='btn mx-4 px-8 btn-warning' onClick={handleSave}>Save </button>
         <a className='btn mx-4 btn-success'  download="output" href={bg} >Download </a>
      </div>

      <Stage style={{
        transform: window.innerWidth > 736 ? "scale(33%)" : "scale(24.5%)"
      }} ref={ref} width={(1500)} height={(500)}>
        <Layer >
        <Group>

            <Image 
                width={(1500)} 
                height={(500)}
                image={bgImage} 
                scaleX={(1)} 
                scaleY={(1)}
              />

            <Image
              image={image}
              x={750}
              y={250}
              width={200}
              height={200}
              id="image"
              draggable
              ref={imageRef}
              onClick={handleSelect}  
              onTouchEnd={handleSelect}         
               />
              
            <Transformer 
              ref={trRef} 
            /> 
            
          </Group>
        </Layer>
      </Stage>
    </div>
  );
}

export default App;
