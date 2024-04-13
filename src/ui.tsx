import { Typography } from 'antd';
import useStore from './store/useStore';

const UI = () => {
    const store = useStore()
    return (
        <div style={{position: 'absolute', zIndex: 8123781237812, bottom: 25, left: 25}}>
        <Typography style={{color: 'green'}}>Selected: {store.selected.map(s => <span>{parseInt(s)}, </span>)}</Typography>
        <Typography style={{color: 'green'}}>Origin: {store.origin}</Typography>
        <Typography style={{color: 'lightblue'}}>Resources: {store.resources}</Typography>
      </div>
    )
}

export default UI