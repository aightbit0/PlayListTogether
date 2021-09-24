import React, { useState , useEffect} from 'react';
import {
  EuiBasicTable,
  EuiLink,
  EuiImage,
  EuiButton,
  EuiSpacer,
} from '@elastic/eui';
import { Delete } from './Delete';

export const UserTable = (props) => {
  const [modalrender,setModalrenderer] = useState(<div></div>)
  const [toggler,setToggler] = useState(true)
  const [items, setItems] = useState([])

  useEffect(() =>{
   console.log("Im Endpoint angekommen")
   console.log(props.newItems);
   if(items.length < 15){
    if(props.newItems.length != 0){
      setItems(items => [...items, props.newItems]);
     }
   }else{
     console.log("Maximum erreicht")
   }
   
  },[props.newItems])

  let DeleteItem = (id) =>{
    console.log("ist angekommen DELETE")
    console.log(id)
  }

  const columns = [
    {
      field: 'picture',
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
      onClick: () => {
        if(field != "songname"){
          if(toggler){
            setToggler(false)
        }else{
          setToggler(true)
        }
          setModalrenderer(<Delete del={(id) => DeleteItem(id)} toggle={toggler} show={item.songname}/>)
        }
      },
      'data-test-subj': `cell-${id}-${field}`,
      textOnly: true,
    };
  };

  return (
    <div>
      <h3>Hi {props.user}</h3>
      <br/>
    <h2>Bucket ({items.length} of 15)</h2><br/>
    <EuiBasicTable
      items={items}
      rowHeader="firstName"
      columns={columns}
      rowProps={getRowProps}
      cellProps={getCellProps}
    />
    {modalrender}
    <EuiSpacer/>
    <EuiButton isDisabled={true} color="primary">Merge</EuiButton>
    </div>
  );
};