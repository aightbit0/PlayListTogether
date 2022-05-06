import React, { useState, useEffect, useRef } from 'react';
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

  const listInnerRef = useRef();
  const INCREASEVALUE = 30;
  const [fromPosition, setfromPosition] = useState(0)
  const [bucketLoaded, setBucketLoaded] = useState(false)
  const [actualPlaylistLength, setActualPlaylistLength] = useState(0)


  let onScroll = () => {
    if (listInnerRef.current) {
      const { scrollTop, scrollHeight, clientHeight } = listInnerRef.current;
      if (scrollTop + clientHeight >= scrollHeight -2) {
          if(bucketLoaded && fromPosition <= actualPlaylistLength){
            loadPlaylist(fromPosition+INCREASEVALUE, false)
            setfromPosition(fromPosition+INCREASEVALUE)
            setBucketLoaded(false)
          }
      }
    }
  }

  useEffect(() =>{
    if(props.user){
      localStorage.setItem("actual_page","public")
      if(localStorage.getItem("playlist") && localStorage.getItem("playlist") != ''){
        loadPlaylist(fromPosition+INCREASEVALUE, true);
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
          /*
          if(result){
            setItems(result);
          }
          */
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
      width:'70%',
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
      'data-test-subj': `cell-${id}-${field}`,
      textOnly: true,
      onClick: () => {
        if(field == "picture"){
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
    <h2>{localStorage.getItem("playlist")} ({actualPlaylistLength})</h2><br/>
    {err}
   
    <div className={"eui-yScroll play"}onScroll={(e) =>onScroll(e)} ref={listInnerRef}>
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