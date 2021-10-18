import { EuiComboBox,EuiFieldText,EuiSpacer,EuiButton,EuiText } from '@elastic/eui';
import React, { useState, useEffect } from 'react';

const options = [];

for (let i = 1; i < 10; i++) {
    options.push({
      label: `Options ${i}`,
    });
}

//Todo server request to get all users and server request to check if playlist alredy exits
export const GroupComp= (props) => {
  const [selectedOptions, setSelected] = useState([]);
  const [playlistname, setPlaylistname] = useState('');
  const [amount, setAmount] = useState(1);

  const onChange = (selectedOptions) => {
    setSelected(selectedOptions);
  };
  
  return (
      <div>
           <EuiComboBox
      placeholder="Select one or more Users"
      options={options}
      selectedOptions={selectedOptions}l
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
   
    <EuiButton color="primary">Create</EuiButton>
    </div>
  );
};

