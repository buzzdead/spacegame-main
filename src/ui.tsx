import { Typography } from 'antd';
import useStore from './store/useStore';

const UI = () => {
    const store = useStore()
    return (
        <div style={{position: 'absolute', zIndex: 8123781237812, top: 25, left: 25, display: 'flex', gap: 45}}>
        <Typography style={{color: 'green'}}>Selected: {store.selected.map((s, id) => <span key={id}>{parseInt(s)}, </span>)}</Typography>
        <Typography style={{color: 'yellowgreen'}}>Origin: {store.origin}</Typography>
        <Typography style={{color: 'lightblue'}}>Resources: {store.resources}</Typography>
      </div>
    )
}

export default UI