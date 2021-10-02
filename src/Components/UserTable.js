import React, { useState , useEffect} from 'react';
import {
  EuiBasicTable,
  EuiLink,
  EuiImage,
  EuiButton,
  EuiSpacer,
  EuiToast,
  EuiLoadingChart,
  EuiIcon,
} from '@elastic/eui';
import { Delete } from './Delete';

export const UserTable = (props) => {
  const [modalrender,setModalrenderer] = useState(<div></div>)
  const [toggler,setToggler] = useState(true)
  const [items, setItems] = useState([])
  const [bds, setBds] = useState(true);
  const [err, setErr] = useState(<div></div>);
  const [amount, setAmount] = useState(0);
  const [loaded, setLoaded] = useState(false);
  const [loadinganimation, setLoadingAnimation] = useState(<EuiLoadingChart size="xl" />)

  useEffect(() =>{
    if(props.user){
      loadBucket();
    }
  },[props.user])

  useEffect(() =>{
    console.log("hallo")
      
        console.log(items.length)
        console.log(amount)
        if(items.length != 0){
          setBds(false)
        }else{
          setBds(true)
        }
  },[amount, items])

  
  let loadBucket = async () =>{
    const requestOptions = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer '+localStorage.getItem("token") },
      body: JSON.stringify({ 
        token: localStorage.getItem("token"), 
        user: props.user,
       })
  };
  
    fetch("http://192.168.0.73:8080/a/getbucket",requestOptions)
    .then(res => res.json())
    .then(
      (result) => {
        if(result == "no acess"){
          localStorage.setItem("token", '');
          localStorage.setItem("user", '');
          window.location.reload();
        }else{
          //console.log(result);
          if(result){
            setItems(result);
          }else{
            setItems([]);
          }
         
          setLoadingAnimation(<div></div>);
          fetch("http://192.168.0.73:8080/getamount")
          .then(res => res.json())
          .then(
            (result) => {
              setAmount(parseInt(result));
              setLoaded(true)
              //console.log(result);
            },
            (error) => {
            console.log("failed fetching amount")
            PrintError();
            }
          )
          
        }
      },
      (error) => {
        localStorage.setItem("token", '');
        localStorage.setItem("user", '');
        window.location.reload();
       console.log("failed fetching bucket")
       PrintError();
      }
    )
   
    return
  }

  let PrintError = () =>{
    setErr( <EuiToast
      title="Something went wrong"
      color="danger"
      iconType="alert"
      onClick = {() =>setErr(<div></div>)}
    ></EuiToast>)
  }

  useEffect(() =>{
   console.log("Im Endpoint angekommen")
   //console.log(props.newItems);
   if(loaded){
     if(items.length < amount){
      if(props.newItems.length != 0){
        addSongToBucket(props.newItems)
        loadBucket();
        //hier dann adden und rerendern
        //setItems(items => [...items, props.newItems]);
        
       }
     }else{
       setErr( <EuiToast
        title="MAXIMUM"
        color="danger"
        iconType="alert"
        onClick = {() =>setErr(<div></div>)}
      ></EuiToast>)
     }
   }
  },[props.newItems])


  let addSongToBucket = (obj) =>{
    console.log(obj.uri)
    const requestOptions = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer '+localStorage.getItem("token") },
      body: JSON.stringify({ name: props.user, 
        token: localStorage.getItem("token"), 
        uri: obj.uri, 
        songname: obj.name, 
        artist: obj.album.artists[0].name, 
        picture:obj.album.images[0].url,
        url: obj.external_urls.spotify,
       })
  };

  fetch('http://192.168.0.73:8080/a/addsongtobucket', requestOptions)
      .then(response => response.json())
      .then(
        (result) => {
          if(result == "exists"){
            setErr(<EuiToast
              title="SONG EXIST"
              color="danger"
              iconType="alert"
              onClick = {() =>setErr(<div></div>)}
            >
              <p>The Song exists already</p>
            </EuiToast>)
          }

          if(result != "acess denied"){
            setErr( <EuiToast
              title="Adeded to  Bucket"
              color="success"
              iconType="check"
              onClick = {() =>setErr(<div></div>)}
            >
              <p>Sucess</p>
            </EuiToast>)
           loadBucket();
          }
        
          else{
            localStorage.setItem("token", '');
            localStorage.setItem("user", '');
            window.location.reload();
          }
        },
        (error) => {
          setErr(<EuiToast
            title="No Connection"
            color="danger"
            iconType="alert"
            onClick = {() =>setErr(<div></div>)}
          >
            <p>No Connection</p>
          </EuiToast>)
        }
      )
  }

  

  let DeleteItem = (id) =>{
    //console.log(id)
    const requestOptions = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer '+localStorage.getItem("token") },
      body: JSON.stringify({ 
        token: localStorage.getItem("token"), 
        user: props.user,
        id: parseInt(id)
       })
  };
    fetch("http://192.168.0.73:8080/a/delete",requestOptions)
    .then(res => res.json())
    .then(
      (result) => {
        //console.log(result);
        if(result == "sucess"){
          //console.log(result);
          setLoaded(true)
          setErr( <EuiToast
            title="Deleted Song"
            color="success"
            iconType="check"
            onClick = {() =>setErr(<div></div>)}
          >
            <p>Sucess</p>
          </EuiToast>)
          loadBucket();
        }else{
          localStorage.setItem("token", '');
          localStorage.setItem("user", '');
          window.location.reload();
        }
      },
      (error) => {
       console.log("failed fetching delete")
       PrintError();
      }
    )
  }

  let merge = () =>{
    const requestOptions = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer '+localStorage.getItem("token") },
      body: JSON.stringify({ 
        token: localStorage.getItem("token"), 
        user: props.user,
       })
  };
    fetch("http://192.168.0.73:8080/a/merge",requestOptions)
    .then(res => res.json())
    .then(
      (result) => {
        //console.log(result);
        if(result == "sucess"){
          setErr( <EuiToast
            title="Merged to Playlist"
            color="success"
            iconType="check"
            onClick = {() =>setErr(<div></div>)}
          >
            <p>Sucess</p>
          </EuiToast>)
          loadBucket();
        }else{
          localStorage.setItem("token", '');
          localStorage.setItem("user", '');
          window.location.reload();
        }
      },
      (error) => {
       console.log("failed fetching delete")
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
      field: 'd',
      name: 'delete',
      truncateText: true,
      render: (item) => (
        <EuiIcon size="m" type="trash" />
      ),
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
      onClick: () => {
        if(field == "d"){
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
    <p>{props.user}s Bucket ({items.length} of {amount})<EuiSpacer/><EuiButton onClick={() => merge()} isDisabled={bds} color="primary">Merge</EuiButton></p><br/>
    {err}
    {loadinganimation}
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
    </div>
  );
};