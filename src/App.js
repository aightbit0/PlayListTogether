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
        //fetch zur überprüfung
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
      body: JSON.stringify({ name: theuser, password: passwd, token: "hjsgdhjsdf56sd7f57dsfgjsdgfsdzf67sd65f7sdgjehsdofd7f9s" })
  };

  fetch('http://192.168.0.73:8080/login', requestOptions)
      .then(response => response.json())
      .then(
        (result) => {
          console.log(result)
          if(result != "acess denied"){
            localStorage.setItem('token', result);
            localStorage.setItem('user', theuser);
            setCont(<PageLay toggleTheme={() => themeChanger()} user={theuser}/>);
          }else{
            setErr(<EuiToast
              title="Not Authorised"
              color="danger"
              iconType="alert"
              onClick = {() =>setErr(<div></div>)}
            >
              <p>Not Authorised Access (Du kommst hier net rein)</p>
            </EuiToast>)
          }
        },
        (error) => {
         console.log("fail")
          console.log(error);
          setErr(<EuiToast
            title="No Connection"
            color="danger"
            iconType="alert"
            onClick = {() =>setErr(<div></div>)}
          >
            <p>No Connection</p>
          </EuiToast>)
        }
      )
  }
  
  return (
    <div className="App">
      {err}
      {cont}
    </div>
  );
}

export default App;
