import React, { useState } from 'react';
import {
  EuiBasicTable,
  EuiLink,
  EuiImage,
} from '@elastic/eui';
import { Delete } from './Delete';

/*
Example user object:

{
  id: '1',
  firstName: 'john',
  lastName: 'doe',
  github: 'johndoe',
  dateOfBirth: Date.now(),
  nationality: 'NL',
  online: true
}

Example country object:

{
  code: 'NL',
  name: 'Netherlands',
  flag: '🇳🇱'
}
*/



export const UserTable = () => {
  const [modalrender,setModalrenderer] = useState(<div></div>)
  const [toggler,setToggler] = useState(true)

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
      field: 'User',
      name: 'User',
    },
  ];
  
  const items = [{
    id: '1',
    Picture: 'https://i.ytimg.com/vi/4ZHwu0uut3k/hqdefault.jpg?sqp=-oaymwEbCKgBEF5IVfKriqkDDggBFQAAiEIYAXABwAEG&rs=AOn4CLDaYizE-kiElhtI_i6ZWw-EZWWtCQ',
    Title: 'Some Sample Song',
    User: 'Sven',
    Dislikes:"1",
  },
  {
    id: '2',
    Picture: 'https://i.ytimg.com/vi/vg1hRBVgMmk/hqdefault.jpg?sqp=-oaymwEbCKgBEF5IVfKriqkDDggBFQAAiEIYAXABwAEG&rs=AOn4CLDY9hxotLxrHixM3kQwUkOZCmiQCg',
    Title: 'Gimme Luv',
    User: 'Sven',
    Dislikes:"0",
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
        setModalrenderer(<Delete toggle={toggler} show={item.id}/>)
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
    <h2>Bucket (2 of 15)</h2><br/>
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