import { EuiComboBox,EuiFieldText,EuiSpacer,EuiButton,EuiText } from '@elastic/eui';

import React, { useState, useEffect } from 'react';
import axios from 'axios';

export const CreatePlaylist= (props) => {
const [clientId, setClientId] = useState('')
const [secretId, setSecretId] = useState('')
const [code, setCode] = useState('')
const [oauth, setOAuth] = useState('')

useEffect(() => {
    if(localStorage.getItem("client")){
       setClientId(localStorage.getItem("client"))
        
    }
    if(localStorage.getItem("secret")){
        setSecretId(localStorage.getItem("secret"))
         
     }
  },[]);

  useEffect(() => {
   console.log("ekommen")
   console.log(props.acode)
   if(props.acode){
    setCode(props.acode)
    getAuthToken(props.acode);
   }
  


  },[props.acode]);


let getAuthToken = (hcode) =>{
    let bodys = "grant_type=authorization_code";
    bodys += "&code=" + hcode; 
    bodys += "&redirect_uri=" + encodeURI('http://localhost:3000/');
    bodys += "&client_id=" + localStorage.getItem("client");
    bodys += "&client_secret=" + localStorage.getItem("secret");

    const requestOptions = {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded', 'Authorization' : 'Basic ' + btoa(localStorage.getItem("client") + ':' + localStorage.getItem("secret")) },
        body: bodys
    };
    
      fetch("https://accounts.spotify.com/api/token",requestOptions)
      .then(res => res.json())
      .then(
        (result) => {
          console.log(result)
          setOAuth(result.access_token)
        },
        (error) => {
         
         console.log("failed fetching")
      
        }
      )
}

let authSpotify = () =>{
    localStorage.setItem("secret",secretId)
    localStorage.setItem("client",clientId)
    let url = "https://accounts.spotify.com/authorize?client_id="+clientId+"&response_type=code&redirect_uri=http://localhost:3000/&scope=user-read-private user-read-email playlist-modify-public playlist-modify-private"
    window.location.href = url;
}
  return (
      <div>
          <EuiFieldText
    placeholder="Client ID"
    value={clientId}
    onChange={(e) => setClientId(e.target.value)}
    aria-label="Use aria labels when no actual label is in use"
  /><EuiSpacer/>
       
    <EuiFieldText
    placeholder="Secret ID"
    value={secretId}
    onChange={(e) => setSecretId(e.target.value)}
    aria-label="Use aria labels when no actual label is in use"
  /><EuiSpacer/>

<EuiFieldText
    placeholder="code"
    value={code}
    aria-label="Use aria labels when no actual label is in use"
  /><EuiSpacer/>
   
    <EuiButton onClick = {() => authSpotify()} color="primary">Authenticate</EuiButton>
    <EuiSpacer/>
    <EuiFieldText
    placeholder="OAuth"
    value={oauth}
    aria-label="Use aria labels when no actual label is in use"
  /><EuiSpacer/>
   <EuiFieldText
    placeholder="User ID"
    //value={code}
    aria-label="Use aria labels when no actual label is in use"
  /><EuiSpacer/>
    <EuiFieldText
    placeholder="Name of Playlist"
    //value={code}
    aria-label="Use aria labels when no actual label is in use"
  /><EuiSpacer/>
  <EuiButton  color="primary">Create Playlist</EuiButton><EuiSpacer/>
  <EuiFieldText
    placeholder="Songs"
    //value={code}
    aria-label="Use aria labels when no actual label is in use"
  /><EuiSpacer/>
   <EuiButton  color="primary">Add Songs</EuiButton><EuiSpacer/>
    </div>
  );
};

