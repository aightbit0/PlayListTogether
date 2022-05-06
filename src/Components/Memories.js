import {EuiLoadingChart, EuiSpacer } from '@elastic/eui';
import React, { useState, useEffect, useRef } from 'react';
import { BACKENDURL } from '../constants';

export const Memories= (props) => {



const [content, setContent] = useState([])
const [loadinganimation, setLoadingAnimation] = useState(<EuiLoadingChart size="xl"  />);
const [bigImage, setBigImgage] = useState(null)
const [fromImage, setFromImage] = useState(0)

const [imagesLoaded, setImagesLoaded] = useState(false)
const listInnerRef = useRef();
const INCREASEVALUE = 5;
useEffect(() =>{
    if(props.user){
        localStorage.setItem("actual_page","memories")
      getImages(fromImage,INCREASEVALUE);
    }
},[props.user])

let showBigPic =(src) =>{  
    setBigImgage(<img src={src} className="imagebig" width="100%"/>)
}


let onScroll = () => {
    if (listInnerRef.current) {
      const { scrollTop, scrollHeight, clientHeight } = listInnerRef.current;
      if (scrollTop + clientHeight >= scrollHeight -2) {
          if(imagesLoaded){
            getImages(fromImage+INCREASEVALUE,INCREASEVALUE)
            setFromImage(fromImage+INCREASEVALUE)
            setImagesLoaded(false)
          }
      }
    }
  }

let getImages = (from,to) =>{
    setLoadingAnimation(<EuiLoadingChart size="xl"/>)
    const requestOptions = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' , 'Authorization': 'Bearer '+localStorage.getItem("token")},
        body: JSON.stringify({ 
        token: localStorage.getItem("token"), 
        user: props.user,
        playlistname: localStorage.getItem("playlist"),
        from: parseInt(from),
        to: parseInt(to)
        })
    };
    fetch(BACKENDURL+"/playlist/getmemories",requestOptions)
    .then((res) => {
        if(res.status == 401 || !res){
        localStorage.setItem("token", '');
        localStorage.setItem("user", '');
        window.location.reload();
        return
        } 
        if(res){
            return res.json()
        } 
        return
    },(error) => {
        console.log(error)
       })
    .then(
        (result) => {
            if(result){
                let allImages = [];
                if(result.length == 0){
                    setLoadingAnimation(<div></div>)
                    setImagesLoaded(false)
                    return
                }
                for (let i = 0; i < result.length; i++) {
                    allImages.push(<img className='image' src={result[i].base64Code} onClick={()=>showBigPic(result[i].base64Code)}/>);
                }

                setContent( content => [...content, allImages])
                setLoadingAnimation(<div></div>)
                setImagesLoaded(true)
                return
            }
            setContent([<p>no images</p>])
            setLoadingAnimation(<div></div>)
            return
        }
    )
    }
  return (
      <div>
          <div className='imageShower' onClick={()=>setBigImgage(null)}>
            {bigImage}
          </div>
          <div className='image-container eui-yScroll play' onScroll={(e) =>onScroll(e)} ref={listInnerRef}>
          <h2>{props.playlistname}</h2>
            {content}
            <EuiSpacer></EuiSpacer>
            {loadinganimation}
        </div>
       </div>
  );
};