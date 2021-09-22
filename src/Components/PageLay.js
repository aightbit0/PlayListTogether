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

export const PageLay = (props) => {
  const [bucketSelected, setBucketSelected] = useState(true);
  const [playListSelected, setPlayListSelected] = useState(false);
  const [nitems, setNItems] = useState([]);
  const [content, setContent] = useState(<div><Search/>
    <UserTable newItems={nitems}/></div>)

  let reloadTable = (items) =>{
    console.log("angekommen im reloadTable")
    setNItems(items)
  }

  useEffect(() => {
    console.log("nitems haben sich geändert")
    setContent(<div><Search reload={(items) => reloadTable(items)} user={props.user}/>
        <UserTable newItems={nitems} user={props.user}/></div>)
   },[nitems]);

  useEffect(() => {
   console.log(bucketSelected)
    if(bucketSelected){
      setContent(<div><Search reload={(items) => reloadTable(items)} user={props.user}/>
        <UserTable newItems={nitems} user={props.user}/></div>)
    }
    if(playListSelected){
      setContent(<div><PublicPlaylist user={props.user}/></div>)
    }
  },[bucketSelected,playListSelected]);

  let setBucket = () =>{
    setBucketSelected(true)
    setPlayListSelected(false)
  }

  let setPlaylist = () =>{
    setBucketSelected(false)
    setPlayListSelected(true)
  }

  let logOut = () =>{
    localStorage.setItem("token",'')
    localStorage.setItem("user",'')
    window.location.reload();
  }

  return(
    <EuiPage paddingSize="none">
      <EuiPageBody>
        <EuiPageHeader
          restrictWidth
          paddingSize="l"
          pageTitle="PlayListTogether"
          tabs={[{ label: 'Bucket', isSelected: bucketSelected,  onClick: () => {setBucket()}}, 
          { label: 'public Playlist', isSelected: playListSelected, onClick: () => {setPlaylist()} },
          { label: 'Theme',  onClick: () => props.toggleTheme()},
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

 
