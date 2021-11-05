import { EuiCollapsibleNav, EuiButton, EuiTitle, EuiSpacer, EuiLink, EuiLoadingChart } from '@elastic/eui';
import React, { useState } from 'react';
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
      fetch(BACKENDURL+"/a/getplaylists",requestOptions)
      .then(res => res.json())
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
      allPlaylists.push(<div><EuiButton onClick={() => props.rerender(i.playlistname)}>
      {i.playlistname}
    </EuiButton><EuiSpacer /></div>)
    })

    setplaylists(allPlaylists)
  }

  let createCreatedPlaylists = (res) =>{
    let allCreatedPlaylists = [];
    res.map((i) =>{
      if(i.playlisturl != ""){
        allCreatedPlaylists.push(<EuiLink href={i.playlisturl} target={"_blank"}>{i.playlistname}</EuiLink>)
      }
    })
    if(allCreatedPlaylists.length == 0){
      allCreatedPlaylists.push(<div>no created Playlists</div>)
    }
    setcreatedplaylists(allCreatedPlaylists)
  }

  return (
      <EuiCollapsibleNav
        isOpen={navIsOpen}
        size={300}
        button={
          <EuiButton onClick={() => loadPlaylists()}>
            Select Playlist
          </EuiButton>
        }
        onClose={() => setNavIsOpen(false)}
      >
        <div style={{ padding: 16 }}>
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
        </div>
      </EuiCollapsibleNav>
  );
};
