import { EuiComboBox,EuiFieldText,EuiSpacer,EuiButton,EuiToast } from '@elastic/eui';
import React, { useState, useEffect } from 'react';
import { BACKENDURL } from '../constants';

export const Memories= (props) => {

const [items, setItems] = useState([])

const [content, setContent] = useState([])
    
useEffect(() =>{
    if(props.user){
      getImages();
    }
    },[props.user])

    
let getImages = () =>{
    const requestOptions = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' , 'Authorization': 'Bearer '+localStorage.getItem("token")},
        body: JSON.stringify({ 
        token: localStorage.getItem("token"), 
        user: props.user,
        playlistname: localStorage.getItem("playlist")
        })
    };
    fetch(BACKENDURL+"/playlist/getmemories",requestOptions)
    .then((res, error) => {
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
                setItems(result)
                let allImages = [];
                for (let i = 0; i < result.length; i++) {
                    
                    allImages.push(<img className='image' src={result[i].base64Code}/>);
                    }
                    setContent(allImages)
                    return
            }
            setContent([<p>no images</p>])
            return
        }
    )
    }
  return (
      <div>
          <div className='image-container eui-yScroll play'>
          <h2>{props.playlistname}</h2>
            {content}
        </div>
       </div>
      
  );
};