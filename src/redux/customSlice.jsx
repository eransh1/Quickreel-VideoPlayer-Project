import { createSlice } from "@reduxjs/toolkit";

let initialState={
    videoUrl:null,
    videoTime:0,
    isVideoPlaying:false,
    currentTime:0,
    isClearCanvasClicked:false,
    isVideoSeeked:0
}

const customSlice=createSlice({
    name:"customSlice",
    initialState,
reducers:{
    setVideoUrl:(state,action)=>{
        state.videoUrl=action.payload
    },
    setVideoTime:(state,action)=>{
        state.videoTime=action.payload
    },
    setIsVideoPlaying:(state,action)=>{
        state.isVideoPlaying=action.payload
    },
    setCurrentTimer:(state,action)=>{
        state.currentTime=action.payload
    },    
    setIsClearCanvasClicked:(state,action)=>{
        state.isClearCanvasClicked=action.payload
    },
    setIsVideoSeeked:(state,action)=>{
        state.isVideoSeeked=action.payload
    },
}
})
export const {setVideoUrl,
    setVideoTime,setIsVideoSeeked,
    setIsVideoPlaying,
    setCurrentTimer,
    setIsClearCanvasClicked}=customSlice.actions
export default customSlice.reducer