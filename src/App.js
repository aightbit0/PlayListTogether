import logo from './logo.svg';
import './App.css';
//import { useEffect, useState } from 'react';
import React, { useEffect, useState } from 'react';
import {PageLay} from './Components/PageLay';
import {Login} from './Components/Login';
//import '@elastic/eui/dist/eui_theme_light.css';
import '@elastic/eui/dist/eui_theme_dark.css';
import {
  EuiToast,
} from '@elastic/eui';
import { BACKENDURL } from './constants';


function App() {
  useEffect(() =>{
    if(!localStorage.getItem('theme')){
      localStorage.setItem('theme', "dark");
    }
    if(localStorage.getItem('theme') == "light"){
      import('@elastic/eui/dist/eui_theme_light.css');
    }
    if(localStorage.getItem('token') && localStorage.getItem('user')){
      if(localStorage.getItem('token') != '' && localStorage.getItem('user') != ''){
        setCont(<PageLay toggleTheme={() => themeChanger()} user={localStorage.getItem('user')}/>);
      }
    }
  },[])

  let themeChanger = () =>{
    if(localStorage.getItem('theme') == "dark"){
      localStorage.setItem('theme', "light");
    }else{
      localStorage.setItem('theme', "dark");
    }
    window.location.reload();
  }

  const [cont, setCont] = useState(<Login check={(us,pw) => isAuth(us,pw)}/> )
  const [err, setErr] = useState(<div></div>);

  let isAuth = (theuser, passwd) =>{
    const requestOptions = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: theuser, password: passwd })
  };

  fetch(BACKENDURL+'/login', requestOptions)

  .then((res) => {
    if(res.status == 401){
      setErr(<EuiToast
        title="Not Authorised"
        color="danger"
        iconType="alert"
        onClick = {() =>setErr(<div></div>)}
      >
        <p>Not Authorised Access (Du kommst hier net rein)</p>
      </EuiToast>)
      return
    }
    return res.json()

  })
  .then(
    (result) => {
      if(result){
        localStorage.setItem('token', result);
        localStorage.setItem('user', theuser);
        setCont(<PageLay toggleTheme={() => themeChanger()} user={theuser}/>);
      }
    },(error) => {
      setErr(<EuiToast
        title="No Connection"
        color="danger"
        iconType="alert"
        onClick = {() =>setErr(<div></div>)}
      >
        <p>No Connection</p>
      </EuiToast>)
    })
  }
  
  return (
    <div className="App">
      <meta name="viewport" content="initial-scale=1, maximum-scale=1"/>
      {err}
      {cont}
    </div>
  );
}

export default App;
