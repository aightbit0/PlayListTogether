import React, { useState, useEffect } from 'react';
import {
  EuiBasicTable,
  EuiLink,
  EuiImage,
} from '@elastic/eui';
import { Dislike } from './Dislike';

export const PublicPlaylist = (props) => {

  const [modalrender,setModalrenderer] = useState(<div></div>)
  const [toggler,setToggler] = useState(true)
  const [items, setItems] = useState([])

  useEffect(() =>{
    if(props.user){
      loadPlaylist();
    }
  },[props.user])

  let loadPlaylist = async () =>{
    console.log(localStorage.getItem("token"));
    console.log(props.user);
    const requestOptions = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ 
        token: localStorage.getItem("token"), 
        user: props.user,
       })
  };
    fetch("http://192.168.0.73:8080/getplaylist",requestOptions)
    .then(res => res.json())
    .then(
      (result) => {
        console.log(result);
        setItems(result);
      },
      (error) => {
       console.log("failed fetching amount")
      }
    )

    return
  }

  let DislikeItem = (id) =>{
    //fetch
    console.log("ist angekommen DISLIKE")
    console.log(id)

    const requestOptions = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ 
        token: localStorage.getItem("token"), 
        user: props.user,
        id: parseInt(id)
       })
  };
    fetch("http://localhost:8080/dislike",requestOptions)
    .then(res => res.json())
    .then(
      (result) => {
        console.log(result);
      },
      (error) => {
       console.log("failed fetching delete")
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
      render: (name) => (
        <EuiLink href="#" target="_blank">
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
      field: 'dislikes',
      name: 'Dislikes',

    },
  ];

  const getRowProps = (item) => {
    const { id } = item;
    return {
      'data-test-subj': `row-${id}`,
      className: 'customRowClass',
      onClick: () => {
          if(toggler){
              setToggler(false)
          }else{
            setToggler(true)
          }
          setModalrenderer(<Dislike dis={(id) => DislikeItem(id)} toggle={toggler} show={item.id}/>)
      },
    };
  };

  const getCellProps = (item, column) => {
    const { id } = item;
    const { field } = column;
    return {
      className: 'customCellClass',
      'data-test-subj': `cell-${id}-${field}`,
      textOnly: true,
    };
  };

  return (
    <div>
    <h2>Die Playlist ({items.length})</h2><br/>
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