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
const [onlineUris, setOnlineUris] = useState([])
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

    if(localStorage.getItem("playlistID")){
      setPlaylistId(localStorage.getItem("playlistID"))
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

let calculateRounds = (amount) =>{
  let insg = amount
  let rest = insg % 100;
  let rounds = (insg-rest)/100;
  if(rest != 0){
      rounds = rounds+1;
  }

  return rounds
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
      if(result.length > 100){
        let rounds = calculateRounds(result.length)
        for (var i = 1; i <= rounds; i++) {
          if(i <= rounds){
            zw.push(result.slice((i-1)*100,i*100).join())
          }else{
            zw.push(result.slice((i-1)*100).join())
          }
        }
      }else{
        zw.push(result.join())
      }
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



let  addSongBucketToPlaylist = (uriBucket) =>{
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
        onClick = {() =>window.location.href = RELOADURL}
      >
        <p>Sucess</p>
      </EuiToast>)
      return true
    },
    (error) => {
      PrintError()
    }
  )
}

let  deleteSongBucketToPlaylist = (uriBucket) =>{
  const requestOptions = {
    method: 'DELETE',
    headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer '+oauth},
    body: JSON.stringify({ 
      tracks: uriBucket,
     })
};

  fetch("https://api.spotify.com/v1/playlists/"+playlistId+"/tracks",requestOptions)
  .then(res => res.json())
  .then(
    (result) => {
     console.log(result)
     setErr( <EuiToast
      title="Songs added to  Playlist"
      color="success"
      iconType="check"
      onClick = {() =>window.location.href = RELOADURL}
    >
      <p>Sucess</p>
    </EuiToast>)
    },
    (error) => {
      PrintError()
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

function difference(setA, setB) {
  var _difference = new Set(setA);
  for (var elem of setB) {
      _difference.delete(elem);
  }
  return _difference;
}

let  checkDifference = async() =>{
  let promises = [];
  let test = await getOnlinePlaylistSongs(0)
  promises.push(test);

  let offset = 0;
  let total = test.total;
  let rounds = calculateRounds(total)
  console.log(rounds)
  
  for (let i = 1; i <= rounds-1; i++) {
    offset+=100;
    promises.push(await getOnlinePlaylistSongs(offset));
  }

  console.log(promises)

  var localPlaylist = new Set();
  var onlinePlaylist = new Set();

  let localToArray =  uris.split(",")

  for (var i = 0; i <localToArray.length; i++) {
    localPlaylist.add(localToArray[i])
  }

  for (var d = 0; d <promises.length; d++) {
    for (var p = 0; p <promises[d].items.length; p++) {
      onlinePlaylist.add(promises[d].items[p].track.uri)
    }
  }

  
  let toAdd = difference(localPlaylist,onlinePlaylist)
  let toDelete = difference(onlinePlaylist,localPlaylist)

  //console.log(toAdd)
  //console.log(toDelete)

  let text = "Add "+toAdd.size+" Songs and Delete "+toDelete.size+" Songs";
  alert(text)

  let toAddArray = [...toAdd];
  //console.log(toAddArray)

  let toDeleteArray = [...toDelete];

  //console.log(toDeleteArray)

  //ADD SONGS TO PLAYLIST LIVE
  if(toAdd.size > 100){
    let zw = [];
    let rounds = calculateRounds(toAddArray.length)
    for (var i = 1; i <= rounds; i++) {
      if(i <= rounds){
        zw.push(toAddArray.slice((i-1)*100,i*100).join())
      }else{
        zw.push(toAddArray.slice((i-1)*100).join())
      }
    }
    console.log(zw)
    for (var i = 0; i < zw.length; i++) {
      addSongBucketToPlaylist(zw[i]);
    }

  }else{
    addSongBucketToPlaylist([...toAdd])
  }

  //DELETE SONGS TO PLAYLIST LIVE
  if(toDelete.size > 100){
    let zw = [];
    let rounds = calculateRounds(toDeleteArray.length)

   
    for (var i = 1; i <= rounds; i++) {
      if(i <= rounds){
        let tempArr = toDeleteArray.slice((i-1)*100,i*100);
        let makeObjToDelete = [{}]
        for (var x = 0; x <tempArr.length; x++) {
          makeObjToDelete[x] = {"uri":tempArr[x]}
         }
        zw.push(makeObjToDelete)
      }else{
        let tempArr = toDeleteArray.slice((i-1)*100);
        let makeObjToDelete = [{}]
        for (var x = 0; x <tempArr.length; x++) {
          makeObjToDelete[x] = {"uri":tempArr[x]}
         }
        zw.push(makeObjToDelete)
      }
    }

    //console.log(zw)
    for (var i = 0; i < zw.length; i++) {
      deleteSongBucketToPlaylist(zw[i])
    }
    
  }else{
    let makeObjToDelete = [{}]
    for (var x = 0; x <toDeleteArray.length; x++) {
     makeObjToDelete[x] = {"uri":toDeleteArray[x]}
    }
    //console.log(makeObjToDelete)
    deleteSongBucketToPlaylist(makeObjToDelete)
  }
}



let getOnlinePlaylistSongs =  (offset) =>{
  const requestOptions = {
    method: 'GET',
    headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer '+oauth},
};

//if get playlist also buckets
  return fetch("https://api.spotify.com/v1/playlists/"+playlistId+"/tracks?fields=items(added_by.id%2Ctrack(uri))%2Ctotal&limit=100&offset="+offset+"",requestOptions)
  .then(res => res.json())
  .then(
    (result) => {
  
      return result
    }
    
  )
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
    disabled={true}
  /><EuiSpacer/>
   
    <EuiButton onClick = {() => authSpotify()} color="primary">Authenticate</EuiButton>
    <EuiSpacer/>
    <EuiFieldText
    disabled={true}
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
  
   <EuiButton onClick={() =>checkDifference()}  color="primary">Update Songs</EuiButton><EuiSpacer/>
   <EuiLink href={localStorage.getItem("genPlalist")} target={"_blank"}>{localStorage.getItem("genPlalist")}</EuiLink>
    </div>
  );
};

