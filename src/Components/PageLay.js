import React, { useEffect, useState } from 'react';

import {Search} from './Search';
import {UserTable} from './UserTable';

import {
  EuiPage,
  EuiPageContent,
  EuiPageHeader,
  EuiPageBody,
  EuiPageContentBody,
} from '@elastic/eui';

import { PublicPlaylist } from './PublicPlaylist';
import { GroupComp } from './GroupComp';
import { CreatePlaylist } from './CreatePlaylist';
import { BACKENDURL } from '../constants';
import { Memories } from './Memories';

export const PageLay = (props) => {
  const [bucketSelected, setBucketSelected] = useState(true);
  const [playListSelected, setPlayListSelected] = useState(false);
  const [groupSelected, setGroupSelected] = useState(false);
  const [createSelected, setCreateSelected] = useState(false);
  const [memoriesSelected, setMemoriesSelected] = useState(false);
  
  const [code, setCode] = useState('');
  const [nitems, setNItems] = useState([]);
  const [content, setContent] = useState(<div><Search/>
    <UserTable newItems={nitems}/></div>)

  let reloadTable = (items) =>{
    setNItems(items)
  }

  useEffect(() => {
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    const code = urlParams.get('code')
    setCode(code)
    if(code){
      setCreate()
    }
    else{
      switch (localStorage.getItem("actual_page")) {
        case "public":
          setPlaylist();
          
          break;
        case "bucket":
          setBucket();
      
          break;
        case "create":
          setNewGroup();
        
          break;
          case "memories":
            setMemories();
           
            break;
        default:
         localStorage.setItem("actual_page","bucket")
          break;
      }
    }
   },[]);

  useEffect(() => {
    setContent(<div><Search reload={(items) => reloadTable(items)} user={props.user}/>
        <UserTable newItems={nitems} user={props.user}/></div>)
   },[nitems]);

  useEffect(() => {
    if(bucketSelected){
      setContent(<div><Search reload={(items) => reloadTable(items)} user={props.user}/>
        <UserTable newItems={nitems} user={props.user}/></div>)
    }
    if(playListSelected){
      setContent(<div><PublicPlaylist user={props.user}/></div>)
    }
    if(groupSelected){
      setContent(<GroupComp></GroupComp>)
    }
    if(createSelected){
      setContent(<CreatePlaylist user={props.user} acode={code}></CreatePlaylist>)
    }
    if(memoriesSelected){
      setContent(<Memories user={props.user} playlistname={localStorage.getItem("playlist")}></Memories>)
    }
  },[bucketSelected,playListSelected,createSelected,groupSelected]);

  let setBucket = () =>{
    setBucketSelected(true)
    setPlayListSelected(false)
    setGroupSelected(false)
    setCreateSelected(false)
    setMemoriesSelected(false)
  }

  let setPlaylist = () =>{
    setBucketSelected(false)
    setGroupSelected(false)
    setPlayListSelected(true)
    setCreateSelected(false)
    setMemoriesSelected(false)
  }

  let setNewGroup = () =>{
    setBucketSelected(false)
    setGroupSelected(true)
    setPlayListSelected(false)
    setCreateSelected(false)
    setMemoriesSelected(false)
  }

  let setCreate = () =>{
    setCreateSelected(true)
    setBucketSelected(false)
    setGroupSelected(false)
    setPlayListSelected(false)
    setMemoriesSelected(false)
  }

  let setMemories = () =>{
    setCreateSelected(false)
    setBucketSelected(false)
    setGroupSelected(false)
    setPlayListSelected(false)
    setMemoriesSelected(true)
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
  
  return(
    <EuiPage paddingSize="none">
      <EuiPageBody>
        <EuiPageHeader
        className={"tp"}
          restrictWidth
          paddingSize="s"
         
          tabs={[{ label: 'Bucket', isSelected: bucketSelected,  onClick: () => {setBucket()}}, 
          { label: 'public Playlist', isSelected: playListSelected, onClick: () => {setPlaylist()} },
          { label: 'Memories <3', isSelected: memoriesSelected, onClick: () => setMemories()},
          { label: 'create Playlist', isSelected: groupSelected, onClick: () => {setNewGroup()} },
          { label: 'deploy/edit Playlist', isSelected: createSelected, onClick: () => {setCreate()} },
          //{ label: 'Theme',  onClick: () => props.toggleTheme()},
          {label: "Log out",onClick: () => logOut()}]}
        />
        <EuiPageContent borderRadius="none" hasShadow={false} paddingSize="none">
          <EuiPageContentBody restrictWidth paddingSize="l">
           {content}
          </EuiPageContentBody>
        </EuiPageContent>
      </EuiPageBody>
    </EuiPage>
  );
}

 
