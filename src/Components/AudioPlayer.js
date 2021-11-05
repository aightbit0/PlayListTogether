
import React, { useState,useEffect } from 'react';

import {
  EuiButtonIcon,
} from '@elastic/eui';

export const AudioPlayer= (props) => {
    const [toggle1On, setToggle1On] = useState(true);
    const [audioObj, setTAudioObj] = useState(null);

      useEffect(() => {
        setTAudioObj(new Audio(props.audiourl));
      },[props.audiourl]);

      let handleAudio = () =>{
        if(toggle1On){
          audioObj.play();
        }else{
          audioObj.pause();
        }
        setToggle1On((isOn) => !isOn);
      }
      
  return (
    <div>
      <EuiButtonIcon
        size="m"
        title={toggle1On ? 'Play' : 'Pause'}
        aria-label={toggle1On ? 'Play' : 'Pause'}
        iconType={toggle1On ? 'play' : 'pause'}
        onClick={() => handleAudio()}
      />
    </div>
  );
};