import { Typography } from 'antd';
import useStore from '../store/useStore';
import { useEffect, useState } from 'react';

const UI = () => {
    const [helperUi, setHelperUi] = useState("Click on one of the cargo spaceships to get started")
    const store = useStore()
    useEffect(() => {
      if(store.selected.length > 0 && helperUi === "Click on one of the cargo spaceships to get started")
        setHelperUi("Great! Now left-click on one of the asteroids, and then on the debris-field behind them")
      else if(store.destination !== undefined && helperUi === "Great! Now left-click on one of the asteroids, and then on the debris-field behind them") setHelperUi("")
    }, [store.selected, store.destination])
    useEffect(() => {
      if(store.ships.find(ship => ship.assetId === "fighter") && helperUi === "") setHelperUi("hold ctrl and left click fighter ship to shoot laser")
    }, [store.ships])
    
    return (
        <div style={{userSelect: 'none', position: 'absolute', zIndex: 8123781237812, top: 25, left: 25, display: 'flex', gap: 45, flexWrap: 'wrap'}}>
        <Typography style={{color: 'green'}}>Selected: {store.selected.map((s, id) => <span key={id}>{s.assetId}{s.id}, </span>)}</Typography>
        <Typography style={{color: 'yellowgreen'}}>Origin: {store.origin}</Typography>
        <Typography style={{color: 'lightblue'}}>Resources: {store.resources}</Typography>
        <Typography style={{color: 'white'}}>{helperUi}</Typography>
      </div>
    )
}

export default UI