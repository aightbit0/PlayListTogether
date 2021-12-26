import { EuiComboBox,EuiFieldText,EuiSpacer,EuiButton,EuiText,EuiLink,EuiToast } from '@elastic/eui';

import React, { useState, useEffect } from 'react';
import { BACKENDURL } from '../constants';
import { RELOADURL } from '../constants';


export const CreatePlaylist= (props) => {
const [clientId, setClientId] = useState('')
const [secretId, setSecretId] = useState('')
const [code, setCode] = useState('')
const [oauth, setOAuth] = useState('')
const [uris, setUris] = useState('')
const [divideduris, setDividedUris] = useState([])
const [err, setErr] = useState(<div></div>);

const [uid, setUid] = useState('')
const [playlistname, setPlaylistname] = useState(localStorage.getItem("playlist"))
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

let saveCreatedPlaylist = (url, plname) =>{
  const requestOptions = {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer '+localStorage.getItem("token") },
    body: JSON.stringify({ 
      token: localStorage.getItem("token"), 
      user: localStorage.getItem("user"),
      playlisturl: url,
      playlistname: plname
     })
};

  fetch(BACKENDURL+"/a/saveplaylist",requestOptions)
  .then((res) => {
    if(res.status == 401){
      localStorage.setItem("token", '');
      localStorage.setItem("user", '');
      window.location.reload();
      return
    }  
    return res.json()
  })
  .then(
    (result) => {
      setErr( <EuiToast
        title="Saved Playlist"
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
  .then((res) => {
    if(res.status == 401){
      localStorage.setItem("token", '');
      localStorage.setItem("user", '');
      window.location.reload();
      return
    }  
    return res.json()
  })
  .then(
    (result) => {
      if(result){
        let zw = [];
        console.log("insg: ",result.length)
        let insg = result.length
        let rest = insg % 100;
        let rounds = (insg-rest)/100;
        
        if(result.length > 100){
          for (var i = 1; i <= rounds+1; i++) {
            if(i <= rounds){
              console.log(result.slice((i-1)*100,i*100).length)
              zw.push(result.slice((i-1)*100,i*100).join())
            }else{
              console.log(result.slice((i-1)*100).length)
              zw.push(result.slice((i-1)*100).join())
            }
          }
        }else{
          zw.push(result.join())
        }

        console.log(zw)
        setDividedUris(zw);
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
      saveCreatedPlaylist(result.external_urls.spotify, result.name)
    },
    (error) => {
      alert("FAIL playlist not saved")
    }
  )
}

let addSongsToPlaylistPublic = () =>{
  for (var i = 0; i < divideduris.length; i++) {
    addSongBucketToPlaylist(divideduris[i]);
  }

  window.location.href = RELOADURL;
}

let addSongBucketToPlaylist = (uriBucket) =>{
  const requestOptions = {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer '+oauth},
    body: ''
};

  fetch("https://api.spotify.com/v1/playlists/"+playlistId+"/tracks?uris="+uriBucket+"",requestOptions)
  .then(res => res.json())
  .then(
    (result) => {
      setErr( <EuiToast
        title="Songs added to  Playlist"
        color="success"
        iconType="check"
        onClick = {() =>setErr(<div></div>)}
      >
        <p>Sucess</p>
      </EuiToast>)
      //window.location.href = RELOADURL;
    },
    (error) => {
      PrintError()
     //console.log("failed fetching")
    }
  )
} 


let getAuthToken = (hcode) =>{
    let bodys = "grant_type=authorization_code";
    bodys += "&code=" + hcode; 
    bodys += "&redirect_uri=" + RELOADURL+"/";

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
        }
      )
}

let authSpotify = () =>{
    localStorage.setItem("secret",secretId)
    localStorage.setItem("client",clientId)
    let url = "https://accounts.spotify.com/authorize?client_id="+clientId+"&response_type=code&redirect_uri="+RELOADURL+"/&scope=user-read-private user-read-email playlist-modify-public playlist-modify-private"
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

