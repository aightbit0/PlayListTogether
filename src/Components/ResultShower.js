import { htmlIdGenerator } from '@elastic/eui';
import React, { useEffect, useRef, useState } from 'react';
import {
  EuiAccordion,
  EuiPanel,
  EuiButtonGroup,
  EuiSpacer,
  EuiToast,
  EuiFlexItem,
  EuiFlexGroup,
  EuiImage,
  EuiHealth,

} from '@elastic/eui';

export const ResultShower = (props) => {
  const [trigger, setTrigger] = useState('closed');
  const [val, setVal] = useState(<div></div>);
  const [isload, setisload] = useState(false);
  const [err, setErr] = useState(<div></div>);
  const onToggle = (isOpen) => {
    const newState = isOpen ? 'open' : 'closed';
    setTrigger(newState); 
  };

  let getData = (stuff) =>{
    setisload(true);
    fetch("http://192.168.0.73:8080/search?v="+stuff)
    .then(res => res.json())
    .then(
      (result) => {
        setErr(<div></div>)
        setisload(false);
        console.log(result);
        renderThisShit(JSON.stringify(result))
      },
      (error) => {
       console.log("fail")
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
    console.log(obj)
    props.setBack(obj);
  }

  let renderThisShit = (res) =>{
    let objekt = JSON.parse(res);
    //console.log(objekt.length)
    let stuff = [];
    objekt.map((i)=>{
      stuff.push(
      <EuiFlexGroup responsive={true} onClick = {() =>addToBucket(i)} alignItems="center">
      <EuiFlexItem  grow={false} >
      <EuiImage
      size="60px"
      hasShadow
      allowFullScreen = {false}
      alt="Accessible image alt goes here"
      src={i.album.images[0].url}
    />
    
      </EuiFlexItem>
      <EuiFlexItem grow={false}>
      <EuiHealth textSize="m" color="success">
        {i.name}
      </EuiHealth>
      <EuiHealth textSize="s" color="success">
      {i.album.artists[0].name}
    </EuiHealth>
      </EuiFlexItem>
      <div>
        <audio controls>
        <source src={i.preview_url} type="audio/ogg"/>
        <source src={i.preview_url} type="audio/mpeg"/>
      Your browser does not support the audio element.
      </audio>
    </div>
    <EuiSpacer/>
    </EuiFlexGroup>)
    })

    let allTogether = <div className="eui-yScroll oka">
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
      id={htmlIdGenerator()()}
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