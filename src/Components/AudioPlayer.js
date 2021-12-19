
import React, { useState,useEffect } from 'react';

import {
  EuiButtonIcon,
} from '@elastic/eui';

export const AudioPlayer= (props) => {
    const [toggle1On, setToggle1On] = useState(true);
    const [audioObj, setTAudioObj] = useState(null);
    const [isPlaying, setIsPlaying] = useState(false);

      useEffect(() => {
        setTAudioObj(new Audio(props.audiourl));
      },[props.audiourl]);

      useEffect(() => {
        if(audioObj){
          console.log(toggle1On)
          if(!toggle1On){
            if(!isPlaying){
             setIsPlaying(true)
            }
            if(isPlaying){
              audioObj.pause();
              setIsPlaying(false);
              setToggle1On(true);
            }
          }
        }
      },[props.reset]);

      let handleAudio = () =>{
        
        if(toggle1On){
          audioObj.play();
          props.triggerReset();
        }else{
          audioObj.pause();
          setIsPlaying(false)
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