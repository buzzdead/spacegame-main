import React, { useEffect, useRef, useState, ElementRef } from 'react';

interface AudioPlayerProps {
  src: string;
  autoPlay?: boolean; 
  loop?: boolean;
  shouldPlay: boolean
}

const AudioPlayer: React.FC<AudioPlayerProps> = ({ src, autoPlay = false, loop = false, shouldPlay = true }) => {
  const audioRef = useRef<ElementRef<"audio">>(null);
  
  const [hasInteracted, setHasInteracted] = useState(false);

  const handleUserInteraction = () => {
    if (!hasInteracted) {
      setHasInteracted(true);
      audioRef.current?.play();
    }
  };

  useEffect(() => {
    if (autoPlay && hasInteracted) {
      audioRef.current?.play();
    }
    if(!shouldPlay) audioRef.current?.pause()

    window.addEventListener('click', handleUserInteraction);
    window.addEventListener('keydown', handleUserInteraction);

    return () => {
      window.removeEventListener('click', handleUserInteraction);
      window.removeEventListener('keydown', handleUserInteraction);
    };
  }, [autoPlay, hasInteracted, shouldPlay, handleUserInteraction]);

  return (
    <audio muted={false} ref={audioRef} src={src} loop={loop} />
  );
};

export default AudioPlayer;
