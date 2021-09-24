import React, { useState } from 'react';
import {
  EuiBasicTable,
  EuiLink,
  EuiImage,
} from '@elastic/eui';
import { Dislike } from './Dislike';

export const PublicPlaylist = (props) => {

  const [modalrender,setModalrenderer] = useState(<div></div>)
  const [toggler,setToggler] = useState(true)
  //const [items, setItems] = useState([])

  let DislikeItem = (id) =>{
    //fetch
    console.log("ist angekommen DISLIKE")
    console.log(id)
  }

  const columns = [
    {
      field: 'Picture',
      name: 'Picture',
      'data-test-subj': 'firstNameCell',
      render: (name) => (
        <EuiImage
      size="s"
      hasShadow
      allowFullScreen = {false}
      alt="Accessible image alt goes here"
      src={name}
      
    />
      ),
    },
    {
      field: 'Title',
      name: 'Title',
      truncateText: true,
      render: (name) => (
        <EuiLink href="#" target="_blank">
          {name}
        </EuiLink>
      ),
    },
    {
      field: 'Artist',
      name: 'Artist',
    },
    {
      field: 'User',
      name: 'User',
    },
    {
      field: 'Dislikes',
      name: 'Dislikes',

    },
  ];
  
  
  const items = [{
    id: '1',
    Picture: 'https://i.ytimg.com/vi/4ZHwu0uut3k/hqdefault.jpg?sqp=-oaymwEbCKgBEF5IVfKriqkDDggBFQAAiEIYAXABwAEG&rs=AOn4CLDaYizE-kiElhtI_i6ZWw-EZWWtCQ',
    Title: 'Some Sample Song',
    User: 'Sven',
    Dislikes:"1",
    Artist:"pimml"
  },
  {
    id: '2',
    Picture: 'https://i.ytimg.com/vi/vg1hRBVgMmk/hqdefault.jpg?sqp=-oaymwEbCKgBEF5IVfKriqkDDggBFQAAiEIYAXABwAEG&rs=AOn4CLDY9hxotLxrHixM3kQwUkOZCmiQCg',
    Title: 'Gimme Luv',
    User: 'Sven',
    Dislikes:"0",
    Artist:"pimml"
  },
  {
    id: '3',
    Picture: 'https://i.ytimg.com/vi/vg1hRBVgMmk/hqdefault.jpg?sqp=-oaymwEbCKgBEF5IVfKriqkDDggBFQAAiEIYAXABwAEG&rs=AOn4CLDY9hxotLxrHixM3kQwUkOZCmiQCg',
    Title: 'Gimme Luv',
    User: 'Dimitratos',
    Dislikes:"0",
    Artist:"pimml"
  }];
  

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
    <EuiBasicTable
      items={items}
      rowHeader="firstName"
      columns={columns}
      rowProps={getRowProps}
      cellProps={getCellProps}
    />
    {modalrender}
    
    </div>
  );
};