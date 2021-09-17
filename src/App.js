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
    if(localStorage.getItem('theme') == "light"){
      import('@elastic/eui/dist/eui_theme_light.css');
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
    console.log(theuser)
    console.log(passwd)
    if(theuser && theuser != ""){
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
  }
  
  return (
    <div className="App">
      {err}
      {cont}
    </div>
  );
}

export default App;
