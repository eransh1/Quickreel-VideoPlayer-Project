import React, { useEffect, useState } from 'react';
import { fabric } from 'fabric';
import "./Canvas.css"
import { useDispatch, useSelector } from 'react-redux';
import { setIsVideoPlaying } from '../../redux/customSlice';
import styles from "./Canvas.module.css"

const Canvas = () => {
const [fabVideoElem,setFabVideoElem]=useState(null)
const [finalCanvas,setFinalCanvas]=useState(null)
const dispatch=useDispatch()
const videoUrl=useSelector(state=>state.customSlice.videoUrl)
const isVideoPlaying=useSelector(state=>state.customSlice.isVideoPlaying)
const currentTime=useSelector(state=>state.customSlice.currentTime)
const isClearCanvasClicked=useSelector(state=>state.customSlice.isClearCanvasClicked)
const [windowInnerWidth, setWidth] = useState(window.innerWidth);

const updateWidth = () => {
  setWidth(window.innerWidth);
};

useEffect(() => {
  window.addEventListener("resize", updateWidth);
  return () => window.removeEventListener("resize", updateWidth);
}, []);


    function getVideoElement(url) {
        var videoE = document.createElement('video');
        videoE.id='video121'
        videoE.width = 1200;
        videoE.height = 700;
        videoE.muted = true;
        videoE.src=url
        return videoE;
    }

  useEffect(() => {
if(videoUrl){
    if(finalCanvas){
        finalCanvas.getObjects()
    }
        const canvas = new fabric.Canvas('my-canvas', {
            // width: 1000,
            height: 420,
            backgroundColor:'#fafafafa',
            selectable:false
          });
          var canvasWidth = windowInnerWidth;  
          canvas.setWidth(canvasWidth*.9) 

          setFinalCanvas(canvas)
          const videoE = getVideoElement(videoUrl);
        //   const videoE = document.getElementById('video121');
          // Create a sample object (e.g., a rectangle)
          const fab_video = new fabric.Image(videoE, {
            left: 200,
            top: 300,
            originX: 'center',
            originY: 'center',
            objectCaching: false,
    
        });

            canvas.add(fab_video)
            setFabVideoElem(fab_video)
            fab_video.getElement().play();
            dispatch(setIsVideoPlaying(true))
          // Add the object to the canvas
    
          // Enable object movement
          fab_video.set({ selectable: true,movable: true });
    
          // Render the canvas
          // canvas.renderAll();
          canvas.requestRenderAll()    
          fabric.util.requestAnimFrame(function render() {
            // canvas.renderAll();
            canvas.requestRenderAll();            
            fabric.util.requestAnimFrame(render);
         });
         // Clean up the canvas when the component unmounts
         return () => {
            canvas.dispose();
          };
}
    
   
  
  }, [videoUrl]);

useEffect(()=>{
if(fabVideoElem){
    if(isVideoPlaying){
        fabVideoElem.getElement().play()
    }
    else{
        fabVideoElem.getElement().pause()
    }
}
},[isVideoPlaying])


useEffect(()=>{
    if(fabVideoElem){
    
        fabVideoElem.getElement().currentTime= currentTime
    
          
    }
},[currentTime])


useEffect(()=>{
if(isClearCanvasClicked){
    setFabVideoElem(null)
    document.querySelector("#video121").pause()
    finalCanvas.clear()
    // setFinalCanvas(null)
}
},[isClearCanvasClicked])

  return (
    <section className={styles.outerCont}>
      <canvas id="my-canvas" />
      <video id="video121" src={videoUrl} autoPlay muted loop style={{display:"none"}}></video>
    </section>
  );
};

export default Canvas;
