import React, { useEffect, useState } from 'react';
import '../styles/checkmark.css';

interface Props {
    shouldComplete: boolean
}

export const Checkmark = ({shouldComplete}: Props) => {
  const [checkClass, setCheckClass] = useState('check');
  const [fillClass, setFillClass] = useState('fill');
  const [pathClass, setPathClass] = useState('path');

  useEffect(() => {
    let timer1: any;
    let timer2: any;

    if (shouldComplete) {
      // If shouldComplete is true, speed up the animation and complete it
      setCheckClass('check check-complete');
      setFillClass('fill fill-complete');
      timer1 = setTimeout(() => {
        setCheckClass('check check-complete success');
        setFillClass('fill fill-complete success');
        setPathClass('path path-complete');
      }, 2000); // Speed up the completion to 1 second
    } else {
      // If shouldComplete is false, proceed with the original timing
      timer1 = setTimeout(() => {
        setCheckClass('check check-complete');
        setFillClass('fill fill-complete');
      }, 5000);

      timer2 = setTimeout(() => {
        setCheckClass('check check-complete success');
        setFillClass('fill fill-complete success');
        setPathClass('path path-complete');
      }, 6000);
    }

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
    };
  }, [shouldComplete]);

  return (
    <div className="checkmark">
      <svg
        version="1.1"
        xmlns="http://www.w3.org/2000/svg"
        xmlnsXlink="http://www.w3.org/1999/xlink"
        xmlSpace="preserve"
        viewBox="0 0 100 100"
        id="checkmark"
      >
        <g transform="">
          <circle className={pathClass} fill="none" stroke="#7DB0D5" strokeWidth="4" strokeMiterlimit="10" cx="50" cy="50" r="44" />
          <circle className={fillClass} fill="none" stroke="#7DB0D5" strokeWidth="4" strokeMiterlimit="10" cx="50" cy="50" r="44" />
          <polyline className={checkClass} fill="none" stroke="#7DB0D5" strokeWidth="8" strokeLinecap="round" strokeMiterlimit="10" points="70,35 45,65 30,52" />
        </g>
      </svg>
    </div>
  );
};

export default Checkmark;