import { FC } from 'react';
import { SGS } from '../../store/UseStore';
import { Refinary } from './constructiontypes/Refinary';
import { EnemyConstruction } from './constructiontypes/EnemyConstruction';
import { ShipFactory } from './constructiontypes/ShipFactory';

interface Props {
  construction: SGS['Construction'];
}

const Construction: FC<Props> = ({ construction }) => {
  if(construction.type === "Refinary") return <Refinary construction={construction}/>
  else if (construction.type === "Enemy") return <EnemyConstruction construction={construction}/>
  else if (construction.type === "Construction") return <ShipFactory construction={construction}/>
  return null
};

export default Construction;
