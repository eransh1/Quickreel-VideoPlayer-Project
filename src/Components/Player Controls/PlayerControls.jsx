import React, { useEffect, useState } from 'react'
import styles from "./Playercontrols.module.css"
import {HiSpeakerWave,HiSpeakerXMark} from "react-icons/hi2"
import {BsFillPlayFill,BsPauseFill} from "react-icons/bs"
import { useDispatch, useSelector } from 'react-redux'
import { setCurrentTimer, setIsVideoPlaying } from '../../redux/customSlice'

const PlayerControls = () => {
  const dispatch=useDispatch()
    const [seekerWidth,setSekerWidth]=useState(0)
    const[isMute,setIsMute]=useState(false)
    const isVideoPlaying=useSelector(state=>state.customSlice.isVideoPlaying)
    const videoTime=useSelector(state=>state.customSlice.videoTime)
    const currentTime=useSelector(state=>state.customSlice.currentTime)
    const isClearCanvasClicked=useSelector(state=>state.customSlice.isClearCanvasClicked)

//HANDLE MUTE OF MUSIC
useEffect(()=>{
  if(document.querySelector("#video121")){
        if(!isMute){document.querySelector("#video121").muted=isMute;return}
        document.querySelector("#video121").muted=isMute 
  }
            
            // eslint-disable-next-line
},[isMute,isVideoPlaying])


useEffect(()=>{
  
    let timerId
    if(!isVideoPlaying){clearInterval(timerId)}
    if(isVideoPlaying){
        timerId= setInterval(()=>{
            if(document.querySelector("#video121")){
           
            const playTime =(document.querySelector("#video121").currentTime);
            dispatch(setCurrentTimer(playTime))
            setSekerWidth((playTime*100)/videoTime)
            }
        },500)
 
    }
    // eslint-disable-next-line
},[isVideoPlaying])


//HANDLE AUDIO PLAYING
useEffect(()=>{

if(!isVideoPlaying){document.querySelector("#video121").pause();return}
document.querySelector("#video121").play()

 
    // eslint-disable-next-line
},[isVideoPlaying])

const handleSeekerClick=(e)=>{
    
    let outerDiv=e.target
    let containerWidth = outerDiv.offsetWidth;
    let mouseX = e.clientX - outerDiv.getBoundingClientRect().left;
    let percentage = (mouseX / containerWidth) * 100;
    setSekerWidth(percentage)
    document.querySelector("#video121").currentTime =(videoTime*percentage)/100
  }

 //GET DURATION
 function getDuration(time){
    const minutes = Math.floor(time / 60);
    const seconds = Math.round(time - minutes * 60);
    return`${minutes}:${seconds<10?"0"+seconds:seconds}`
  } 

  useEffect(()=>{
if(isClearCanvasClicked){
    setSekerWidth(0)
    setIsMute(false)  
}
  },[isClearCanvasClicked])
  
  return (
  <>
      <section className={styles.outerCont}>
      <div onClick={handleSeekerClick} className={styles.songSeeker}>
        <p id='seeker_running_inside' style={{width:`${seekerWidth}%`}} className={styles.seekBar}></p>
      </div> 
      <div className={styles.controlerCont}>
        <div className={styles.optionCont}>
          
        </div>
        <div className={styles.player}>
           <div className={styles.playerCont}>
      
            <div className={styles.playBtnCont}>
            {isVideoPlaying?<BsPauseFill onClick={()=>dispatch(setIsVideoPlaying(false))} className={styles.playPauseIcon}/>:<BsFillPlayFill onClick={()=>dispatch(setIsVideoPlaying(true))} className={styles.playPauseIcon}/>}
            </div>
            <p className={styles.timerContShowingTimer}>{`${getDuration(currentTime)}/${getDuration(videoTime)}`}</p>
          
           
           </div> 
           <div onClick={()=>setIsMute(e=>!e)} className={styles.audio}>
            {isMute?<HiSpeakerXMark className={styles.audioIcon}/>:<HiSpeakerWave className={styles.audioIcon}/>}
           </div>
        </div>
      </div>
      </section>
  </>
  )
}

export default PlayerControls