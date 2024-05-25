import { Typography } from "antd";
import { useShallowStore } from "../store/UseStore";
import { useEffect, useState } from "react";
import { SettingOutlined, MenuFoldOutlined, MenuUnfoldOutlined } from "@ant-design/icons";
import { Options } from "./Options";
import Checkmark from "./Checkmark";
import GameMenu from "./GameMenu/GameMenu";

const UI = () => {
  const [showOptions, setShowOptions] = useState(false);
  const [showMenu, setShowMenu] = useState(false)
  const [helperUi, setHelperUi] = useState(
    "Left-click on one of the cargo spaceships to get started"
  );
  const { selected, destination, ships, origin, resources } = useShallowStore([
    "selected",
    "destination",
    "ships",
    "origin",
    "resources",
  ]);
  useEffect(() => {
    if (
      selected.length > 0 &&
      selected.find((e) => e.assetId === "cargo") &&
      helperUi === "Left-click on one of the cargo spaceships to get started"
    )
      setHelperUi(
        "Great! Now left-click on one of the asteroids, then left click on the station behind the asteroids"
      );
    else if (
      helperUi ===
      "Great! Now left-click on one of the asteroids, then left click on the station behind the asteroids"
    )
      setHelperUi(
        "To construct a fighter ship, click on the tall building, then the bubble above it, then select it after by left-clicking on it"
      );
  }, [selected, destination]);
  useEffect(() => {
    if (
      ships.find((ship) => ship.assetId === "fighter") &&
      (helperUi === "" ||
        helperUi ===
          "To construct a fighter ship, click on the tall building, then the bubble above it, then select it after by left-clicking on it")
    )
      setHelperUi(
        "Great, now find one of the cruisers further out and left-click on it"
      );
  }, [ships]);
  if(showMenu) return <GameMenu visible={showMenu} onClose={() => setShowMenu(false)} />
  return (
    <div style={{
      position: "absolute",
      width: '100%',
      height: '100%',
      zIndex: 8123781237812,
      pointerEvents: 'none',
      userSelect: 'none'
    }}>
    <div
      style={{
        position: 'relative',
        top: 25,
        left: 25,
        display: "flex",
        gap: 45,
        flexWrap: "wrap",
      }}
    >
      <Options visible={showOptions} onClose={() => setShowOptions(false)} />
      <SettingOutlined style={{userSelect: 'all', pointerEvents: 'all'}} onClick={() => setShowOptions(true)} />
      {showMenu ? <MenuFoldOutlined  style={{userSelect: 'all', pointerEvents: 'all'}} onClick={() => setShowMenu(false)}/> : <MenuUnfoldOutlined  style={{userSelect: 'all', pointerEvents: 'all'}} onClick={() => setShowMenu(true)}/>}
      <Typography style={{ color: "yellowgreen" }}>Origin: {origin?.position}</Typography>
      <Typography style={{ color: "lightblue" }}>
        Resources: {resources}
      </Typography>
      <Typography style={{ color: "white" }}>{helperUi}</Typography>
    </div>
    <div style={{position: 'absolute', bottom: 15, width: '100%'}}>
      <div style={{position: 'relative', justifyContent: 'center', display: 'flex', flexWrap: 'wrap', gap: 5 }}>
      {selected.map(s => {
        return <img key={s.id} style={{padding: 2.5, border: `1px solid ${s.hull < 30 ? '#ff000030' : s.hull < 50 ? '#0000ff45' : '#00ff0030'}`}} width='40px' height={'25px'} src={s.assetId === "fighter" ? '/assets/fightert.png' : '/assets/cargoship.png'} />
      })}
      </div>
    </div>
    </div>
  );
};

export default UI;
