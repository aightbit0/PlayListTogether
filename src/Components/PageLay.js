import React, { useEffect, useState } from 'react';

import {Search} from './Search';
import {UserTable} from './UserTable';

import {
  EuiPage,
  EuiPageContent,
  EuiPageHeader,
  EuiPageBody,
  EuiPageContentBody,
  EuiButton,
} from '@elastic/eui';

import { PublicPlaylist } from './PublicPlaylist';

export const PageLay = (props) => {
  const [bucketSelected, setBucketSelected] = useState(true);
  const [playListSelected, setPlayListSelected] = useState(false);
  const [content, setContent] = useState(<div><Search/>
    <UserTable/></div>)

  useEffect(() => {
   console.log(bucketSelected)
    if(bucketSelected){
      setContent(<div><Search user={props.user}/>
        <UserTable user={props.user}/></div>)
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

  return(
    <EuiPage paddingSize="none">
      <EuiPageBody>
        <EuiPageHeader
          restrictWidth
          paddingSize="l"
          pageTitle="PlayListTogether"
          tabs={[{ label: 'Bucket', isSelected: bucketSelected,  onClick: () => {setBucket()}}, 
          { label: 'public Playlist', isSelected: playListSelected, onClick: () => {setPlaylist()} },
          { label: 'Theme',  onClick: () => props.toggleTheme()}]}
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

 
