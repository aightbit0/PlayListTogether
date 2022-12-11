import React, { useState , useEffect, useRef} from 'react';
import {
  EuiBasicTable,
  EuiLink,
  EuiImage,
  EuiToast,
  EuiLoadingChart,
} from '@elastic/eui';
import { Delete } from './Delete';
import { Dislike } from './Dislike';
import { Collapse } from './Collaps';
import { BACKENDURL } from '../constants';

export const UserTable = (props) => {
  const [modalrender,setModalrenderer] = useState(<div></div>)
  const [toggler,setToggler] = useState(true)
  const [items, setItems] = useState([])
  const [bds, setBds] = useState(true);
  const [err, setErr] = useState(<div></div>);
  const [amount, setAmount] = useState(0);
  const [loaded, setLoaded] = useState(false);
  const [loadinganimation, setLoadingAnimation] = useState(<EuiLoadingChart size="xl" />)
  const [nav, setNav] = useState(<Collapse rerender = {(name,plid) => rerender(name,plid)}></Collapse>)
  const [actualBucket, setActualBucket] = useState(localStorage.getItem("playlist"))
  const [fromPosition, setfromPosition] = useState(0)
  const [bucketLoaded, setBucketLoaded] = useState(false)
  const listInnerRef = useRef();
  const INCREASEVALUE = 30;
  const [actualBucketLength, setActualBucketLength] = useState(0)
  const [actualPlaylistLength, setActualPlaylistLength] = useState(0)
  

  useEffect(() =>{
    if(props.user){
      localStorage.setItem("actual_page","bucket")
      if(localStorage.getItem("playlist") && localStorage.getItem("playlist") != ''){
        loadBucket(0, false);
        loadPlaylist(fromPosition,false)
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

  let onScroll = () => {
    if (listInnerRef.current) {
      const { scrollTop, scrollHeight, clientHeight } = listInnerRef.current;
      if (scrollTop + clientHeight >= scrollHeight -2) {
        if(bucketLoaded && fromPosition <= actualPlaylistLength){
            loadBucket(0, false)
            loadPlaylist(fromPosition+INCREASEVALUE, false)
            setfromPosition(fromPosition+INCREASEVALUE)
            setBucketLoaded(false)
          }
      }
    }
  }

  useEffect(() =>{
    if(props.user){
      rerender(props.newName, props.newId)
    }
  },[props.newName])

  let rerender = (playlistname,playlistid) =>{
    if (playlistname){
      localStorage.setItem("playlist",playlistname)
    }
    if(playlistid != "" && playlistid !== undefined){
      let zw =playlistid.split("/")
      localStorage.setItem("playlistID",zw[4])
    }else{
      localStorage.setItem("playlistID","")
    }
  
    if(localStorage.getItem("playlist") && localStorage.getItem("playlist") != ''){
      setActualBucket(localStorage.getItem("playlist"))
      loadBucket(fromPosition, true);
      loadPlaylist(fromPosition,true)
    }
  }

  useEffect(() =>{
    if(items.length != 0){
      setBds(false)
    }else{
      setBds(true)
    }
  },[amount, items])

  let clear = () =>{
    const timer = setTimeout(() => {
      setErr(<div></div>)
    }, 3000);
    return () =>{clearTimeout(timer);};
  }


  //testbereich
  let loadPlaylist = async (from, reset) =>{
    if(reset){
      from = 0;
    }
    setLoadingAnimation(<EuiLoadingChart size="xl"  />)
    const requestOptions = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer '+localStorage.getItem("token") },
      body: JSON.stringify({ 
        token: localStorage.getItem("token"), 
        user: localStorage.getItem("user"),
        playlistname: localStorage.getItem("playlist"),
        from: parseInt(from),
        to: parseInt(INCREASEVALUE)
       })
  };
    fetch(BACKENDURL+"/playlist/getplaylist",requestOptions)
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

          if(reset){
            setfromPosition(0)
            setItems([]);
          }

          if(result.data){
            setItems( items => [...items, ...result.data])
           
          }
          
          setActualPlaylistLength(parseInt(result.bucketActualAmount));
          setBucketLoaded(true)
        }else{
          setItems([]);
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

  //ende Testbereich






  
  let loadBucket = async (from, reset) =>{
    if(reset){
      from = 0;
    }
    const requestOptions = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer '+localStorage.getItem("token") },
      body: JSON.stringify({ 
        token: localStorage.getItem("token"), 
        user: localStorage.getItem("user"),
        playlistname: localStorage.getItem("playlist"),
        from: parseInt(from),
        to: parseInt(0)
       })
  };

    
  setLoadingAnimation(<EuiLoadingChart size="xl" />)
    fetch(BACKENDURL+"/playlist/getbucket",requestOptions)
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
        if(result == "no acess"){
          localStorage.setItem("token", '');
          localStorage.setItem("user", '');
          window.location.reload();
        }else{
          if(result){
            setAmount(parseInt(result.amount));
            setActualBucketLength(parseInt(result.bucketActualAmount));
            setLoaded(true)
          }else{
            setItems([]);
          }
          setLoadingAnimation(<div></div>);
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
   if(loaded){
     if(actualBucketLength < amount){
      if(props.newItems.length != 0){
        addSongToBucket(props.newItems)
        loadBucket(fromPosition, true);
        loadPlaylist(fromPosition, true)
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
    const requestOptions = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer '+localStorage.getItem("token") },
      body: JSON.stringify({ name: props.user, 
        token: localStorage.getItem("token"), 
        uri: obj.uri, 
        songname: obj.name, 
        artist: obj.album.artists[0].name, 
        picture:obj.album.images[1].url,
        url: obj.external_urls.spotify,
        playlistname: localStorage.getItem("playlist")
       })
  };

  fetch(BACKENDURL+'/playlist/addsongtobucket', requestOptions)
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

          else if(result != "acess denied"){
            setErr( <EuiToast
              title="Adeded to  Bucket"
              color="success"
              iconType="check"
              onClick = {() =>setErr(<div></div>)}
            >
              <p>Sucess</p>
            </EuiToast>)
            clear();
            loadBucket(fromPosition, true);
            loadPlaylist(fromPosition, true)
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
    const requestOptions = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer '+localStorage.getItem("token") },
      body: JSON.stringify({ 
        token: localStorage.getItem("token"), 
        user: props.user,
        id: parseInt(id)
       })
  };
    fetch(BACKENDURL+"/playlist/delete",requestOptions)
    .then((res) => {
      if(res.status == 401){
        localStorage.setItem("token", '');
        localStorage.setItem("user", '');
        window.location.reload();
        return
      }
      
      if(res.status == 200){
        setLoaded(true)
        setErr( <EuiToast
          title="Deleted Song"
          color="success"
          iconType="check"
          onClick = {() =>setErr(<div></div>)}
        >
          <p>Sucess</p>
        </EuiToast>)
        clear();
        loadBucket(fromPosition, true);
        loadPlaylist(fromPosition, true)
        return res.json()
      }
    })
    .then(
      (result) => {
      },
      (error) => {
       PrintError();
      }
    )
  }

  let DislikeItem = (id) =>{
    const requestOptions = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' , 'Authorization': 'Bearer '+localStorage.getItem("token")},
      body: JSON.stringify({ 
        token: localStorage.getItem("token"), 
        user: props.user,
        id: parseInt(id),
        playlistname: localStorage.getItem("playlist")
       })
  };
    fetch(BACKENDURL+"/playlist/dislike",requestOptions)
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
        
        if(result == "deleted"){
          setErr( <EuiToast
            title="Song deleted"
            color="success"
            iconType="check"
            onClick = {() =>setErr(<div></div>)}
          >
            <p>Sucess</p>
          </EuiToast>)
         }
         loadBucket(fromPosition, true);
          loadPlaylist(fromPosition+INCREASEVALUE, true);
        
      },
      (error) => {
       PrintError();
      }
    )
  }

  const columns = [
    {
      field: 'picture',
      'data-test-subj': 'firstNameCell',
      render: (name) => (
        
        <EuiImage
      size="60px"
      hasShadow
      allowFullScreen = {false}
      alt="X"
      src={localStorage.getItem("performance") =="true"?"":name}
    />
      ),
    },
    {
      field: 'songname',
      truncateText: false,
      width: '70%',
      render: (name, item) => (
        <div>
          <EuiLink href={item.url} target="_blank">
            {item.artist} {name}
          </EuiLink>
      
          <p className={item.dislike > 0?"red":""}>{item.name} ({item.dislike}{item.disliker==""?null:": "+item.disliker})</p>
        </div>
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
        if(field == "picture"){
          if(toggler){
            setToggler(false)
        }else{
          setToggler(true)
        }
        setModalrenderer(props.user == item.name?<Delete del={(id) => DeleteItem(id)} ident={item.id} toggle={toggler} show={item.songname}/>:<Dislike dis={(id) => DislikeItem(id)} ident={item.id} toggle={toggler} show={item.songname}/>)
        }
      },
      'data-test-subj': `cell-${id}-${field}`,
      textOnly: true,
    };
  };

  return (
    <div>
    <p>{props.user}s Bucket {actualBucket} ({actualBucketLength} of {amount}){' '}
  </p>
  <br></br>
  <p>{actualBucket}: {actualPlaylistLength}</p><br/>
    {err}
    <div className={"eui-yScroll bucket"} onScroll={(e) =>onScroll(e)} ref={listInnerRef}>
    <EuiBasicTable
      items={items}
      rowHeader="firstName"
      columns={columns}
      rowProps={getRowProps}
      cellProps={getCellProps}
    />
    {loadinganimation}
    </div>
    {modalrender}
    </div>
  );
};