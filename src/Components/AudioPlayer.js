
import React, { useState,useEffect } from 'react';

import {
  EuiButtonIcon,
} from '@elastic/eui';

export const AudioPlayer= (props) => {
    const [toggle1On, setToggle1On] = useState(true);
    const [audioObj, setTAudioObj] = useState(null);

    

      useEffect(() => {
          console.log("hiiiiiie")
        setTAudioObj(new Audio(props.audiourl));
      },[props.audiourl]);
      
  return (
    <div>
      <EuiButtonIcon
        size="m"
        title={toggle1On ? 'Play' : 'Pause'}
        aria-label={toggle1On ? 'Play' : 'Pause'}
        iconType={toggle1On ? 'play' : 'pause'}
        onClick={() => {
            console.log(props.audiourl)
            
            if(toggle1On){
                console.log("play");
                audioObj.play();
            }else{
                console.log("pause")
                audioObj.pause();
            }
            setToggle1On((isOn) => !isOn);
          }}
      />
    </div>
  );
};