import { EuiComboBox,EuiFieldText,EuiSpacer,EuiButton,EuiText,EuiLink,EuiToast } from '@elastic/eui';

import React, { useState, useEffect } from 'react';
import { BACKENDURL } from '../constants';


export const CreatePlaylist= (props) => {
const [clientId, setClientId] = useState('')
const [secretId, setSecretId] = useState('')
const [code, setCode] = useState('')
const [oauth, setOAuth] = useState('')
const [uris, setUris] = useState('')
const [err, setErr] = useState(<div></div>);

const [uid, setUid] = useState('')
const [playlistname, setPlaylistname] = useState('')
const [playlistId, setPlaylistId] = useState('')
useEffect(() => {
    if(localStorage.getItem("client")){
       setClientId(localStorage.getItem("client"))
    }
    if(localStorage.getItem("secret")){
        setSecretId(localStorage.getItem("secret"))
     }
    if(localStorage.getItem("UserId")){
      setUid(localStorage.getItem("UserId"))
    }
     getSongUris()
  },[]);

  useEffect(() => {
   if(props.acode){
    setCode(props.acode)
    getAuthToken(props.acode);
   }
  },[props.acode]);

  let PrintError = () =>{
    setErr( <EuiToast
      title="Something went wrong"
      color="danger"
      iconType="alert"
      onClick = {() =>setErr(<div></div>)}
    ></EuiToast>)
  }

let setUidAndLocal = (va) =>{
  localStorage.setItem("UserId",va)
  setUid(va)
}

let getSongUris = () =>{
  const requestOptions = {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer '+localStorage.getItem("token") },
    body: JSON.stringify({ 
      token: localStorage.getItem("token"), 
      user: localStorage.getItem("user"),
      playlistname: localStorage.getItem("playlist")
     })
};

  fetch(BACKENDURL+"/a/getsonguris",requestOptions)
  .then(res => res.json())
  .then(
    (result) => {
      if(result){
        setUris(result.join())
      }
    },
    (error) => {
     PrintError()
     console.log("failed fetching")
    }
  )
}


let createPlaylistPublic = () =>{
  const requestOptions = {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer '+oauth},
    body: JSON.stringify({ 
      name: playlistname,
      description: "Generated Playlist from PlayListTogether",
      public: true
     })
};

  fetch("https://api.spotify.com/v1/users/"+uid+"/playlists",requestOptions)
  .then(res => res.json())
  .then(
    (result) => {

      console.log(result)
      setPlaylistId(result.id)
      localStorage.setItem("genPlalist",result.external_urls.spotify)
      setErr( <EuiToast
        title="Created Playlist"
        color="success"
        iconType="check"
        onClick = {() =>setErr(<div></div>)}
      >
        <p>Sucess</p>
      </EuiToast>)
     
    },
    (error) => {
      PrintError()
     console.log("failed fetching")
    }
  )
}

let addSongsToPlaylistPublic = () =>{
  const requestOptions = {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer '+oauth},
    body: ''
};

  fetch("https://api.spotify.com/v1/playlists/"+playlistId+"/tracks?uris="+uris+"",requestOptions)
  .then(res => res.json())
  .then(
    (result) => {
      console.log(result)
      setErr( <EuiToast
        title="Songs added to  Playlist"
        color="success"
        iconType="check"
        onClick = {() =>setErr(<div></div>)}
      >
        <p>Sucess</p>
      </EuiToast>)
      window.location.href = "http://localhist:3000";
    },
    (error) => {
      PrintError()
     console.log("failed fetching")
    }
  )
}


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
          PrintError()
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
        {err}
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
    value={uid}
    onChange={(e) => setUidAndLocal(e.target.value)}
    aria-label="Use aria labels when no actual label is in use"
  /><EuiSpacer/>
    <EuiFieldText
    placeholder="Name of Playlist"
    value={playlistname}
    onChange={(e) => setPlaylistname(e.target.value)}
    aria-label="Use aria labels when no actual label is in use"
  /><EuiSpacer/>
  <EuiButton onClick={() =>createPlaylistPublic()}  color="primary">Create Playlist</EuiButton><EuiSpacer/>
  <EuiFieldText
    placeholder="Songs"
    value={uris}
    aria-label="Use aria labels when no actual label is in use"
  /><EuiSpacer/>
    <EuiFieldText
    placeholder="Playlst ID"
    value={playlistId}
    onChange={(e) => setPlaylistId(e.target.value)}
    aria-label="Use aria labels when no actual label is in use"
  /><EuiSpacer/>
   <EuiButton onClick={() =>addSongsToPlaylistPublic()}  color="primary">Add Songs</EuiButton><EuiSpacer/>
   <EuiLink href={localStorage.getItem("genPlalist")} target={"_blank"}>{localStorage.getItem("genPlalist")}</EuiLink>
    </div>
  );
};

