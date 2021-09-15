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
import { render } from '@testing-library/react';
import { PublicPlaylist } from './PublicPlaylist';

export const PageLay = (props) => {
  const [bucketSelected, setBucketSelected] = useState(true);
  const [playListSelected, setPlayListSelected] = useState(false);
  const [content, setContent] = useState(<div><Search/>
    <UserTable/></div>)

useEffect(() =>{
  if(bucketSelected){
      console.log("mounted")
  }
},[])

  useEffect(() => {
   console.log(bucketSelected)
    if(bucketSelected){
      setContent(<div><Search/>
        <UserTable/></div>)
    }
    if(playListSelected){
      setContent(<div><PublicPlaylist/></div>)
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
          tabs={[{ label: 'Bucket', isSelected: bucketSelected,  onClick: () => {setBucket()}}, { label: 'public Playlist', isSelected: playListSelected, onClick: () => {setPlaylist()} }]}
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

 
