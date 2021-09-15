
import React, { Fragment, useState } from 'react';
import {ResultShower} from './ResultShower';
import {
  EuiFieldSearch,
  EuiFlexGroup,
  EuiFlexItem,
  EuiButton,
} from '@elastic/eui';

export const Search = () => {
    let [searchValue, setSearchValue] = useState('');
    //let [sendToResultShower, setSendToResultShower] = useState('closed');

    let requestHandler = (e) =>{
        setSearchValue(e.target.value)
    }
    
    return (
        <Fragment>
        <EuiFlexGroup>
          <EuiFlexItem>
            <EuiFieldSearch
              placeholder="Search..."
              fullWidth
              aria-label="An example of search with fullWidth"
              value = {searchValue}
              onChange={(e) => requestHandler(e)}
            />
          </EuiFlexItem>
          
        </EuiFlexGroup>
        <ResultShower search={searchValue}/>
      </Fragment>
      );
 
};