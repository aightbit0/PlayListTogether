import { EuiComboBox,EuiFieldText,EuiSpacer,EuiButton,EuiToast } from '@elastic/eui';
import React, { useState, useEffect } from 'react';
import { BACKENDURL } from '../constants';

export const GroupComp= (props) => {
  const [selectedOptions, setSelected] = useState([]);
  const [playlistname, setPlaylistname] = useState('');
  const [amount, setAmount] = useState(10);
  const [options, setOptions] = useState([]);
  const [err, setErr] = useState(<div></div>);

useEffect(() => {
  localStorage.setItem("actual_page","create")
  getUsers()
 },[]);

  const onChange = (selectedOptions) => {
    setSelected(selectedOptions);
  };

  let getUsers = async () =>{
    const requestOptions = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer '+localStorage.getItem("token") },
      body: JSON.stringify({ 
        token: localStorage.getItem("token"), 
        user: localStorage.getItem("user"),
       })
  };
  
    fetch(BACKENDURL+"/playlist/getusers",requestOptions)
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
        let optionsTemp = [];
        for (let i = 0; i < result.length; i++) {
          optionsTemp.push({
              label: result[i].name,
            });
        }
        setOptions(optionsTemp)
      },
      (error) => {
        setErr( <EuiToast
          title="Failed get Users"
          color="danger"
          iconType="alert"
          onClick = {() =>setErr(<div></div>)}
        ></EuiToast>)
      }
    )
   
    return
  }

  let createPlaylist = async () =>{
        
    const requestOptions = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer '+localStorage.getItem("token") },
      body: JSON.stringify({ 
        token: localStorage.getItem("token"), 
        user: localStorage.getItem("user"),
        amount: amount,
        users: selectedOptions,
        playlistname: playlistname
       })
  };
  
    fetch(BACKENDURL+"/playlist/createplaylist",requestOptions)
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
        if(result == "success"){
          setErr( <EuiToast
            title="Playlist created"
            color="success"
            iconType="check"
            onClick = {() =>setErr(<div></div>)}
          ></EuiToast>)
        }else if(result == "exists"){
          setErr( <EuiToast
            title="Error Playlist alredy exists"
            color="danger"
            iconType="alert"
            onClick = {() =>setErr(<div></div>)}
          ></EuiToast>)
        }else{
          setErr( <EuiToast
            title="Error Playlist not created"
            color="danger"
            iconType="alert"
            onClick = {() =>setErr(<div></div>)}
          ></EuiToast>)
        }
      },
      (error) => {
        setErr( <EuiToast
          title="Error Playlist not created"
          color="danger"
          iconType="alert"
          onClick = {() =>setErr(<div></div>)}
        ></EuiToast>)
      }
    )
   
    return
  }


  let checkBeforeCreate = () =>{
    if(playlistname != '' && selectedOptions.length >=1 && amount >= 1){
      console.log("passt")
      let arr = selectedOptions
      arr.push({label: localStorage.getItem("user")})
      setSelected(arr);
      createPlaylist();
    }else{
      setErr( <EuiToast
        title="Input not valid"
        color="danger"
        iconType="alert"
        onClick = {() =>setErr(<div></div>)}
      ></EuiToast>)
    }
  }
  
  return (
      <div>
        {err}
           <EuiComboBox
      placeholder="Select one or more Users"
      options={options}
      selectedOptions={selectedOptions}
      onChange={onChange}
    />
    <EuiSpacer/>
    <EuiFieldText
    placeholder="Name of the Playlist"
    value={playlistname}
    onChange={(e) => setPlaylistname(e.target.value)}
    aria-label="Use aria labels when no actual label is in use"
  /><EuiSpacer/>
  <EuiFieldText
    type="number"
    min="1"
    placeholder="Amount of maximum Songs in Bucket"
    value={amount}
    onChange={(e) => setAmount(parseInt(e.target.value))}
    aria-label="Use aria labels when no actual label is in use"
  /><EuiSpacer/>  
    <EuiButton color="primary" onClick={() =>checkBeforeCreate()}>Create</EuiButton>
    </div>
  );
};