import { EuiCollapsibleNav, EuiButton, EuiTitle, EuiSpacer, EuiLink, EuiLoadingChart, EuiButtonIcon, EuiSwitch } from '@elastic/eui';
import React, { useState, useEffect } from 'react';
import { BACKENDURL } from '../constants';
export const Collapse = (props) => {
  const [navIsOpen, setNavIsOpen] = useState(false);
  const [playlists, setplaylists] = useState(<div>no Playlists</div>)
  const [createdplaylists, setcreatedplaylists] = useState(<div>no created Playlists</div>)
  const [loadinganimation, setLoadingAnimation] = useState(<div></div>)

  let loadPlaylists = () =>{
    setNavIsOpen((isOpen) => !isOpen)
    setLoadingAnimation(<EuiLoadingChart size="xl" />)
    const requestOptions = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer '+localStorage.getItem("token") },
      body: JSON.stringify({ 
        token: localStorage.getItem("token"), 
        user: localStorage.getItem("user"),
        playlist: localStorage.getItem("playlist")
        })
    };
      fetch(BACKENDURL+"/playlist/getplaylists",requestOptions)
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
          if(result == "no acess"){
            localStorage.setItem("token", '');
            localStorage.setItem("user", '');
            window.location.reload();
          }else{
            if(result){
              createPlaylists(result)
              createCreatedPlaylists(result)
              setLoadingAnimation(<div></div>)
            }
          }
        },
        (error) => {
         setplaylists(<div>ERROR</div>)
         setcreatedplaylists(<div>ERROR</div>)
        }
      )
  
      return
  }

  let createPlaylists = (res) =>{
    let allPlaylists = [];
    res.map((i) =>{
      allPlaylists.push(<div><EuiButton onClick={() => {localStorage.setItem("actual_page","bucket");props.rerender(i.playlistname,i.playlisturl)}}>
      {i.playlistname}
    </EuiButton><EuiSpacer /></div>)
    })

    setplaylists(allPlaylists)
  }

  let createCreatedPlaylists = (res) =>{
    let allCreatedPlaylists = [];
    res.map((i) =>{
      if(i.playlisturl != ""){
        allCreatedPlaylists.push(<div><EuiLink href={i.playlisturl} target={"_blank"}>{i.playlistname}</EuiLink><EuiSpacer/></div>)
      }
    })
    if(allCreatedPlaylists.length == 0){
      allCreatedPlaylists.push(<div>no created Playlists</div>)
    }
    setcreatedplaylists(allCreatedPlaylists)
  }

  let logOut = () =>{
    const requestOptions = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer '+localStorage.getItem("token") },
      body: JSON.stringify({ 
        token: localStorage.getItem("token"), 
        user: props.user,
       })
  };
  
    fetch(BACKENDURL+"/playlist/logout",requestOptions)
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
        localStorage.setItem("token",'')
        localStorage.setItem("user",'')
        localStorage.setItem("playlist",'')
        localStorage.setItem("actual_page",'')
        window.location.reload();
      },
      (error) => {
       console.log("failed")
       localStorage.setItem("token",'')
        localStorage.setItem("user",'')
        localStorage.setItem("playlist",'')
        localStorage.setItem("actual_page",'')
        window.location.reload();
      }
    )
   
  }

  return (
      <EuiCollapsibleNav
        isOpen={navIsOpen}
        size={300}
        button={
          <EuiButtonIcon iconType="boxesHorizontal" onClick={() => loadPlaylists()} aria-label="Next" />
        }
        onClose={() => setNavIsOpen(false)}
      >
        <div className='eui-yScroll' style={{ padding: 16 }}>
          {loadinganimation}
          <EuiTitle>
            <h2>Your Playlists</h2>
          </EuiTitle>
          <EuiSpacer />
          {playlists}
          <EuiSpacer />
          <EuiTitle>
            <h2>Created Playlists</h2>
          </EuiTitle>
          <EuiSpacer />
          {createdplaylists}

          <div>
          <EuiButton onClick={() => {localStorage.setItem("actual_page","create");props.rerender(localStorage.getItem("playlist"),localStorage.getItem("playlistID"))}}>
            new Playlist
          </EuiButton>
          <EuiSpacer />
        </div>

        <div>
          <EuiButton onClick={() => {localStorage.setItem("actual_page","update");props.rerender(localStorage.getItem("playlist"),localStorage.getItem("playlistID"))}}>
            Update Playlist
          </EuiButton>
          <EuiSpacer />
        </div>
        <div>
          <EuiButton onClick={() =>logOut()}>
            Logout
          </EuiButton>
          <EuiSpacer />
        </div>
         
        </div>
      </EuiCollapsibleNav>
  );
  // {localStorage.getItem("playlist")!=""?<div><EuiButton color='danger' onClick={() =>logOut()}>Leave Playlist</EuiButton><EuiSpacer /></div>:null}
};