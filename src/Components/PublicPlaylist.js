import React, { useState, useEffect } from 'react';
import {
  EuiBasicTable,
  EuiLink,
  EuiImage,
  EuiToast,
  EuiLoadingChart,
  EuiIcon,
} from '@elastic/eui';
import { Dislike } from './Dislike';
import { BACKENDURL } from '../constants';

export const PublicPlaylist = (props) => {

  const [modalrender,setModalrenderer] = useState(<div></div>)
  const [toggler,setToggler] = useState(true)
  const [items, setItems] = useState([])
  const [err, setErr] = useState(<div></div>);
  const [loadinganimation, setLoadingAnimation] = useState(<EuiLoadingChart size="xl"  />);

  useEffect(() =>{
    if(props.user){
      localStorage.setItem("actual_page","public")
      if(localStorage.getItem("playlist") && localStorage.getItem("playlist") != ''){
        loadPlaylist();
      }else{
        setLoadingAnimation(<div></div>);
        setErr( <EuiToast
          title="Please select a Playlist"
          color="warning"
          iconType="alert"
          onClick = {() =>setErr(<div></div>)}
        ></EuiToast>)
      }
    }
  },[props.user])

  let PrintError = () =>{
    setErr( <EuiToast
      title="Something went wrong"
      color="danger"
      iconType="alert"
      onClick = {() =>setErr(<div></div>)}
    ></EuiToast>)
  }

  let loadPlaylist = async () =>{
    
    const requestOptions = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer '+localStorage.getItem("token") },
      body: JSON.stringify({ 
        token: localStorage.getItem("token"), 
        user: localStorage.getItem("user"),
        playlistname: localStorage.getItem("playlist")
       })
  };
    fetch(BACKENDURL+"/a/getplaylist",requestOptions)
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
            setItems(result);
          }
          setLoadingAnimation(<div></div>)
      },
      (error) => {
      
       console.log("failed fetching amount")
       
       PrintError();
      }
    )

    return
  }

  let DislikeItem = (id) =>{
    const requestOptions = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' , 'Authorization': 'Bearer '+localStorage.getItem("token")},
      body: JSON.stringify({ 
        token: localStorage.getItem("token"), 
        user: props.user,
        id: parseInt(id)
       })
  };
    fetch(BACKENDURL+"/a/dislike",requestOptions)
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
        if(result == "failes"){
          localStorage.setItem("token", '');
          localStorage.setItem("user", '');
          window.location.reload();
        }
        if(result == "alredy"){
          setErr( <EuiToast
            title="Alredy Disliked"
            color="danger"
            iconType="alert"
            onClick = {() =>setErr(<div></div>)}
          ></EuiToast>)
        }
        else{
          loadPlaylist();
        }
      },
      (error) => {
       PrintError();
      }
    )
  }

  const columns = [
    {
      field: 'picture',
      name: 'Picture',
      'data-test-subj': 'firstNameCell',
      render: (name) => (
        <EuiImage
      size="60px"
      hasShadow
      allowFullScreen = {false}
      alt="Accessible image alt goes here"
      src={name}
    />
      ),
    },
    {
      field: 'songname',
      name: 'Title',
      truncateText: true,
      render: (name, item) => (
        <EuiLink href={item.url} target="_blank">
          {name}
        </EuiLink>
      ),
    },
    {
      field: 'artist',
      name: 'Artist',
    },
    {
      field: 'name',
      name: 'User',
    },
    {
      field: 'dislike',
      name: 'Dislikes',

    }
  ];

  const getRowProps = (item) => {
    const { id } = item;
    return {
      'data-test-subj': `row-${id}`,
      className: 'customRowClass',
    };
  };

  const getCellProps = (item, column) => {
    const { id } = item;
    const { field } = column;
    return {
      className: 'customCellClass',
      'data-test-subj': `cell-${id}-${field}`,
      textOnly: true,
      onClick: () => {
        if(field == "dislike"){
          if(toggler){
            setToggler(false)
        }else{
          setToggler(true)
        }
        setModalrenderer(<Dislike dis={(id) => DislikeItem(id)} ident={item.id} toggle={toggler} show={item.songname}/>)
        }
      },
    };
  };

  return (
    <div>
    <h2>{localStorage.getItem("playlist")} ({items.length})</h2><br/>
    {err}
    {loadinganimation}
    <div className={"eui-yScroll play"}>
    <EuiBasicTable
      items={items}
      rowHeader="firstName"
      columns={columns}
      rowProps={getRowProps}
      cellProps={getCellProps}
    />
    </div>
    {modalrender}  
    </div>
  );
};