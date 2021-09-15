import logo from './logo.svg';
import './App.css';
import { useEffect } from 'react';
import {PageLay} from './Components/PageLay';
//import '@elastic/eui/dist/eui_theme_light.css';
import '@elastic/eui/dist/eui_theme_dark.css';


function App() {
  
  useEffect(() => {
   
  },[]);

  return (
    <div className="App">
      <PageLay user="SvenDerAdmin"/>
    </div>
  );
}

export default App;
