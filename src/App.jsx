import React, { useEffect, useRef, useState } from 'react'
import { toast } from 'react-toastify'
import Canvas from './Components/Canvas Trial/Canvas'
import PlayerControls from './Components/Player Controls/PlayerControls'
import { useDispatch, useSelector } from 'react-redux'
import { setCurrentTimer, setIsClearCanvasClicked, setIsVideoPlaying, setVideoTime, setVideoUrl } from './redux/customSlice'
import {generateVideoThumbnails} from "@rajesh896/video-thumbnails-generator";
import styles from "./App.module.css"


const App = () => {
  const dispatch=useDispatch()
  const currentTime=useSelector(state=>state.customSlice.currentTime)
  const videoTime=useSelector(state=>state.customSlice.videoTime)
  const chooseFileRef = useRef(null);
  const [videoFile,setVideoFile]=useState(null)
  const videoUrl=useSelector(state=>state.customSlice.videoUrl)
  const isClearCanvasClicked=useSelector(state=>state.customSlice.isClearCanvasClicked)
  const [thumbnails, setThumbnails] = useState([]);
const[isUploading,setIsUploading]=useState(false)
const[progressBarLeftDistance,setProgressBarLeftDistance]=useState(0)


  const chooseFile = () => {
    if (chooseFileRef.current) {
      chooseFileRef.current.click();
    }
  };

  const handleVideoChange=async (e)=>{
    let videoFile = e.target.files[0];
    if ((Math.round(+videoFile.size / 1024) / 1000) > 100){
      toast.error("File size can not be more than 100mb")
      return
    }
    setVideoFile(videoFile);
      
      if (videoFile) {
        setIsUploading(true)
        setThumbnails([])
        setVideoFile(null)
       dispatch(setVideoTime(0))
       dispatch(setVideoUrl(null))
       dispatch(setIsClearCanvasClicked(false))
        const video = await loadVideo(videoFile)
      dispatch(setVideoTime(video.duration))
      await generateVideoThumb(videoFile,video.duration)
      }
  }

 //TO GENERATE THUMBNAILS OF VIDEO  
 const generateVideoThumb=async(video,videoTotalTime)=>{
  generateVideoThumbnails(video, 10).then((thumbs) => {
  setThumbnails(thumbs)
}).then(()=>{
  setVideoFile(video)
  dispatch(setVideoUrl(URL.createObjectURL(video)))

setIsUploading(false)
}).catch((err)=>{console.log(err);setIsUploading(false)})
}


 //GET DURATION
//  function getDuration(time){
//   const minutes = Math.floor(time / 60);
//   const seconds = Math.round(time - minutes * 60);
//   return`${minutes}:${seconds<10?"0"+seconds:seconds}`
// } 

//DUMMY LOAD VIDEO TO GET DURATION
const loadVideo = file => new Promise((resolve, reject) => {
  try {
      let video = document.createElement('video')
      video.preload = 'metadata'

      video.onloadedmetadata = function () {
          resolve(this)
      }

      video.onerror = function () {
          reject("Invalid video. Please select a video file.")
      }

      video.src = window.URL.createObjectURL(file)
  } catch (e) {
      reject(e)
  }
})


useEffect(()=>{
if(isClearCanvasClicked){
  setThumbnails([])
  setVideoFile(null)
dispatch(setVideoUrl(null))
dispatch(setVideoTime(0))
dispatch(setIsVideoPlaying(false))
dispatch(setCurrentTimer(0))
}
},[isClearCanvasClicked])



useEffect(()=>{

const percent=(1-(videoTime-currentTime)/videoTime)
setProgressBarLeftDistance(percent*100)
},[currentTime])


const handleRangeSlider=(e)=>{
  setProgressBarLeftDistance(e.target.value)
  document.querySelector("#video121").currentTime =(videoTime*e.target.value)/100
}

  return (
   <>
   <h1>Video Editor</h1>
   {videoUrl&&!isUploading&&<button onClick={()=>dispatch(setIsClearCanvasClicked(true))}>Clear Canvas</button>}

{!videoUrl&&!isUploading&&<input onChange={handleVideoChange} ref={chooseFileRef} type="file" accept='video/mp4'/>}
{isUploading&&<div className={styles.videoUploadingConatiner}>
<div className={styles.loader}></div>
<h1>Uploading</h1>
</div>}
   <Canvas/>
   {videoUrl&&<section className={styles.playerControlsOuterCont}><PlayerControls/></section>}

   {thumbnails.length>0&&
<div className={styles.videoTrimmerCont}>
  {thumbnails&&thumbnails.map((item,idx)=>{return <>
    <img key={idx} className={styles.image} src={item} alt="thumbnail" />
  </>})}
  {/* <div id="edit_Video_Trimmer_outer_container"></div> */}
  <div className={styles.edit_Video_Trimmer_outer_container}>
  <input onChange={(e)=>handleRangeSlider(e)} type="range" min={0} max={100} step={0.1} value={progressBarLeftDistance} class={styles.slider} id="myRange"/>
  </div>
  <div style={{left:`${progressBarLeftDistance}%`}} className={styles.progressBarForTrimmer}></div>
  <div style={{width:`${progressBarLeftDistance}%`}} className={styles.leftCoveringCont}></div>
 

</div>}

   </>
  )
}

export default App