import { Typography } from 'antd';
import useStore, { useShallowStore } from '../store/useStore';
import { useEffect, useState } from 'react';

const UI = () => {
    const [helperUi, setHelperUi] = useState("Click on one of the cargo spaceships to get started")
    const { selected, destination, ships, origin, resources} = useShallowStore(["selected", "destination", "ships", "origin", "resources"])
    useEffect(() => {
      if(selected.length > 0 && helperUi === "Click on one of the cargo spaceships to get started")
        setHelperUi("Great! Now left-click on one of the asteroids, and then on the debris-field behind them")
      else if(destination !== undefined && helperUi === "Great! Now left-click on one of the asteroids, and then on the debris-field behind them") setHelperUi("")
    }, [selected, destination])
    useEffect(() => {
      if(ships.find(ship => ship.assetId === "fighter") && helperUi === "") setHelperUi("Great, now find one of the cruisers further out and click on it")
    }, [ships])
    
    return (
        <div style={{userSelect: 'none', position: 'absolute', zIndex: 8123781237812, top: 25, left: 25, display: 'flex', gap: 45, flexWrap: 'wrap'}}>
        <Typography style={{color: 'green'}}>Selected: {selected.map((s, id) => <span key={id}>{s.assetId}{s.id}, </span>)}</Typography>
        <Typography style={{color: 'yellowgreen'}}>Origin: {origin}</Typography>
        <Typography style={{color: 'lightblue'}}>Resources: {resources}</Typography>
        <Typography style={{color: 'white'}}>{helperUi}</Typography>
      </div>
    )
}

export default UI