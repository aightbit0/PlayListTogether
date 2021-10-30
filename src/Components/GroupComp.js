import { EuiComboBox,EuiFieldText,EuiSpacer,EuiButton,EuiText } from '@elastic/eui';
import React, { useState, useEffect } from 'react';
import { BACKENDURL } from '../constants';

//Todo server request to get all users and server request to check if playlist alredy exits
export const GroupComp= (props) => {
  const [selectedOptions, setSelected] = useState([]);
  const [playlistname, setPlaylistname] = useState('');
  const [amount, setAmount] = useState(10);
  const [options, setOptions] = useState([])

  

useEffect(() => {
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
  
    fetch(BACKENDURL+"/a/getusers",requestOptions)
    .then(res => res.json())
    .then(
      (result) => {
        console.log(result)
        let optionsTemp = [];
        for (let i = 0; i < result.length; i++) {
          console.log(result[i])
          optionsTemp.push({
              label: result[i].name,
            });
        }
        setOptions(optionsTemp)
      },
      (error) => {
        console.log(error)
      }
    )
   
    return
  }
  
  return (
      <div>
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
   
    <EuiButton color="primary" onClick={() =>console.log(selectedOptions)}>Create</EuiButton>
    </div>
  );
};

