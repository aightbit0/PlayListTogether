import React, { useState , useEffect} from 'react';
import {
  EuiBasicTable,
  EuiLink,
  EuiImage,
  EuiButton,
  EuiSpacer,
  EuiToast,
} from '@elastic/eui';
import { Delete } from './Delete';

export const UserTable = (props) => {
  const [modalrender,setModalrenderer] = useState(<div></div>)
  const [toggler,setToggler] = useState(true)
  const [items, setItems] = useState([])
  const [bds, setBds] = useState(true);
  const [err, setErr] = useState(<div></div>);
  const [amount, setAmount] = useState(1);
  const [loaded, setLoaded] = useState(false);

  useEffect(() =>{
    if(props.user){
      getamount();
      loadBucket();
    }
  },[props.user])

  useEffect(() =>{
    if(items.length == amount){
      setBds(false)
    }  
  },[amount,items])

  
  let loadBucket = async () =>{
    const requestOptions = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ 
        token: localStorage.getItem("token"), 
        user: props.user,
       })
  };
  
    fetch("http://192.168.0.73:8080/getbucket",requestOptions)
    .then(res => res.json())
    .then(
      (result) => {
        console.log(result);
        setItems(result);
        setLoaded(true)
      },
      (error) => {
       console.log("failed fetching bucket")
      }
    )
   
    return
  }

  let getamount = async () =>{
    fetch("http://192.168.0.73:8080/getamount")
    .then(res => res.json())
    .then(
      (result) => {
        
        setAmount(parseInt(result));
        console.log(result);
        
      },
      (error) => {
       console.log("failed fetching amount")
      }
    )
    return
  }

  useEffect(() =>{
   console.log("Im Endpoint angekommen")
   console.log(props.newItems);
   if(loaded){
     /*
    if(items.length >= (amount -1)){
      setBds(false);
      console.log(amount)
     }
     */
     if(items.length < amount){
      if(props.newItems.length != 0){
        //hier dann adden und rerendern
        //setItems(items => [...items, props.newItems]);
       }
     }else{
       console.log("Maximum erreicht")
     }
   }
  },[props.newItems])

  

  let DeleteItem = (id) =>{
    //fetch
    console.log("ist angekommen DELETE")
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
    fetch("http://localhost:8080/delete",requestOptions)
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

  let merge = () =>{
    const requestOptions = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ 
        token: localStorage.getItem("token"), 
        user: props.user,
       })
  };
    fetch("http://localhost:8080/merge",requestOptions)
    .then(res => res.json())
    .then(
      (result) => {
        console.log(result);
        if(result == "sucess"){
          setErr( <EuiToast
            title="Merged to Playlist"
            color="success"
            iconType="check"
            onClick = {() =>setErr(<div></div>)}
          >
            <p>Sucess</p>
          </EuiToast>)
        }else{
          setErr( <EuiToast
            title="Failed Merged to Playlist"
            color="danger"
            iconType="warning"
            onClick = {() =>setErr(<div></div>)}
          >
            <p>Sucess</p>
          </EuiToast>)
        }
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
      size="50px"
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
          setModalrenderer(<Delete del={(id) => DeleteItem(id)} toggle={toggler} show={item.id}/>)
        }
      },
      'data-test-subj': `cell-${id}-${field}`,
      textOnly: true,
    };
  };

  return (
    <div>
    <p>Bucket ({items.length} of {amount})</p><br/>
    <div className={"eui-yScroll bucket"}>
    <EuiBasicTable
      items={items}
      rowHeader="firstName"
      columns={columns}
      rowProps={getRowProps}
      cellProps={getCellProps}
    />
    </div>
    {modalrender}
    <EuiSpacer/>
    {err}
    <EuiButton onClick={() => merge()} isDisabled={bds} color="primary">Merge</EuiButton>
    </div>
  );
};