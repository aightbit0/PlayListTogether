
import React, { Fragment, useState } from 'react';
import {ResultShower} from './ResultShower';
import {
  EuiFieldSearch,
  EuiFlexGroup,
  EuiFlexItem,
} from '@elastic/eui';

export const Search = (props) => {
    let [searchValue, setSearchValue] = useState('');
    let [stop, setStop] = useState(false);
    let requestHandler = (e) =>{
        setSearchValue(e.target.value)
    }

    let addedtoBucket = (item) =>{
      //setSearchValue('')
      props.reload(item)
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
              onClick={()=>setStop(!stop)}
            />
          </EuiFlexItem>
        </EuiFlexGroup>
        <ResultShower user={props.user} forceStop={stop} search={searchValue} setBack={(item) => addedtoBucket(item)}/>
      </Fragment>
      );
 
};