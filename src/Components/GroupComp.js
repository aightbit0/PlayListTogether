import { EuiComboBox,EuiFieldText,EuiSpacer,EuiButton,EuiText } from '@elastic/eui';

import React, { useState, useEffect } from 'react';
import axios from 'axios';
const options = [];
let groupOptions = [];
for (let i = 1; i < 5000; i++) {
  groupOptions.push({ label: `option${i}` });
  if (i % 25 === 0) {
    options.push({
      label: `Options ${i - (groupOptions.length - 1)} to ${i}`,
      options: groupOptions,
    });
    groupOptions = [];
  }
}

export const GroupComp= (props) => {
  const [selectedOptions, setSelected] = useState([]);

  const onChange = (selectedOptions) => {
    setSelected(selectedOptions);
  };
  
  return (
      <div>
          <EuiText grow={false}><h2>Geht nicht hatte kein Bock das weiter zu machen :)</h2></EuiText>
           <EuiComboBox
      placeholder="Select one or more Users"
      options={options}
      selectedOptions={selectedOptions}l
      onChange={onChange}
    />
    <EuiSpacer/>
    <EuiFieldText
    placeholder="Name of the Playlist"
    //value={value}
    //onChange={(e) => onChange(e)}
    aria-label="Use aria labels when no actual label is in use"
  /><EuiSpacer/>
   
    <EuiButton color="primary">Create</EuiButton>
    </div>
  );
};

