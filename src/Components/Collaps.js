import { EuiCollapsibleNav, EuiButton, EuiTitle, EuiSpacer, EuiLink, EuiCode } from '@elastic/eui';
import React, { useState } from 'react';
import { BACKENDURL } from '../constants';
export const Collapse = (props) => {
  const [navIsOpen, setNavIsOpen] = useState(false);
  const [playlists, setplaylists] = useState(<div>no Playlists</div>)
  const [createdplaylists, setcreatedplaylists] = useState(<div>no created Playlists</div>)

  let loadPlaylists = () =>{
    setNavIsOpen((isOpen) => !isOpen)
    //Todo request to server to get all playlists for user
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
            //console.log(result);
            if(result){
              //setItems(result);
              console.log(result);
              createPlaylists(result)
              createCreatedPlaylists(result)
            }
          }
        },
        (error) => {
         console.log("failed fetching amount")
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
