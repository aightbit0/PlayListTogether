import React, { Fragment, useState } from 'react';

import {
 
  EuiFlexGroup,
  EuiFlexItem,
  EuiSpacer,
  EuiFieldText,
  EuiFieldPassword,
  EuiButton,
  EuiTitle,
  EuiText,
} from '@elastic/eui';


export const Login =(props) => {

    const [password,setPassword] = useState('');
    const [userName,setUserName] = useState('')

    return(
    <div className="login">
        <Fragment>
        <EuiTitle size="l">
        <h1>Welcome to PlayListTogether</h1>
        </EuiTitle>
        <br/>
        <p>This Service is Invite Only!</p>
            <EuiSpacer/>
        <EuiFlexGroup >
            <EuiFlexItem>
            <EuiFieldText
             value={userName}
             onChange={(e) => setUserName(e.target.value)}
            fullWidth
                placeholder="Username"
                aria-label="An example of search with fullWidth"
            />
            <EuiSpacer/>
            <EuiFieldPassword
            fullWidth
            placeholder="Password"
            //type={dual ? 'dual' : undefined}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            aria-label="Use aria labels when no actual label is in use"
        />
            </EuiFlexItem>
        
        </EuiFlexGroup>
        <EuiSpacer/>
        <EuiFlexItem grow={true}>
            <EuiButton onClick={()=> props.check(userName,password)}>Log in</EuiButton>
            </EuiFlexItem>
        </Fragment>
        <EuiSpacer/>
        <p>Welcome to PlayListTogether !</p>
      
        <p>Software made by <a href="https://github.com/aightbit0">aightbit0 aka Svenson</a></p>
            <p>Powered by <a href="https://we-make-your.software">we-make-your.software</a></p>
            <EuiSpacer/>
            <EuiTitle size="l">
        <h1>ACTUAL-FIXES</h1>
        </EuiTitle>
        <EuiText>
        <ul>
        <li>fixed audio problem</li>
        <li>NEW: adding multiple songs to Bucket without closing search results</li>
        <li>NEW: stay on page after reload</li>
      </ul>
        </EuiText>
        </div>
        
    );
    
}