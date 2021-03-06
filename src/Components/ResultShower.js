import { htmlIdGenerator } from '@elastic/eui';
import React, { useEffect, useRef, useState } from 'react';
import {
  EuiAccordion,
  EuiPanel,
  EuiButtonGroup,
  EuiToast,
  EuiFlexItem,
  EuiImage,
  EuiHealth,

} from '@elastic/eui';
import { AudioPlayer } from './AudioPlayer';
import { BACKENDURL } from '../constants';

export const ResultShower = (props) => {
  const [trigger, setTrigger] = useState('closed');
  const [val, setVal] = useState(<div></div>);
  const [isload, setisload] = useState(false);
  const [err, setErr] = useState(<div></div>);
  const [resetAudio, setResetAudio] = useState(false);
  const [holdOld, setHoldOld] = useState("");
  
  const onToggle = (isOpen) => {
    const newState = isOpen ? 'open' : 'closed';
    setTrigger(newState); 
  };

  let hd = "";
  
  useEffect(() => {
    if(holdOld != ""){
      renderThisShit(holdOld)
    }
  },[resetAudio]);


  useEffect(() => {
    setResetAudio(!resetAudio)
  },[props.forceStop]);

  let getData = (stuff) =>{
    setisload(true);
    fetch(BACKENDURL+"/search?v="+stuff)
    .then(res => res.json())
    .then(
      (result) => {
        setErr(<div></div>)
        setisload(false);
        hd = JSON.stringify(result);
        renderThisShit(JSON.stringify(result))
        
      },
      (error) => {
       setisload(false);
       setTrigger("closed")
       setErr( <EuiToast
        title="Couldn't complete the search"
        color="danger"
        iconType="alert"
        onClick = {() =>setErr(<div></div>)}
      >
        <p>Failed Fetching</p>
      </EuiToast>)
      }
    )
  }

  let addToBucket = (obj) =>{
    props.setBack(obj);
  }

  let triggerResetFunc = () =>{
    if(hd != ""){
      setHoldOld(hd)
    }
    setResetAudio(!resetAudio)
  }

  let renderThisShit = (res) =>{
    let objekt = JSON.parse(res);
    let stuff = [];
    objekt.map((i)=>{
      stuff.push(
        <div className={"results"}>
          <EuiImage
      onClick = {() =>addToBucket(i)}
      size="60px"
      hasShadow
      allowFullScreen = {false}
      alt="X"
      src={localStorage.getItem("performance") =="true"?"":i.album.images[1].url}
    />
    <AudioPlayer reset={resetAudio} triggerReset={() => triggerResetFunc()} audiourl={i.preview_url}/>
      <EuiFlexItem grow={false}>
      <EuiHealth textSize="m" color="success">
        {i.name}
      </EuiHealth>
      <EuiHealth textSize="s" color="success">
      {i.album.artists[0].name}
    </EuiHealth>
      </EuiFlexItem>
        </div>)
    })

    let allTogether = <div onScroll={() => document.getElementById("resmaker").focus()} className="eui-yScroll oka">
      {stuff}
    </div>
    setVal(allTogether);
  }

  useEffect(() => {
    if(props.search != ''){
        setTrigger('open');
        const timer = setTimeout(() => {
          getData(props.search)
        }, 500);
        return () =>{clearTimeout(timer);};
        
    }else{
        setErr(<div></div>)
        setTrigger('closed');
        setisload(false);
        triggerResetFunc();
    }
  },[props.search]);

  return (
      <div>
         {err}
   <EuiButtonGroup
      legend="This is a basic group"    
    />
    <EuiAccordion
      arrowDisplay="none"
      id={"resmaker"}
      forceState={trigger}
      onToggle={onToggle}
      buttonContent=""
      padding="l"
      isLoading = {isload}
      isLoadingMessage={"LOADING DATA"}
    >
      <EuiPanel color="subdued">
        {val}
      </EuiPanel>
    </EuiAccordion>
      </div>
  );
};