import { Button, Typography } from "antd";
import useStore, { useShallowStore } from "../store/useStore";
import { useEffect, useState } from "react";
import { SettingOutlined } from "@ant-design/icons";
import { Options } from "./options";

const UI = () => {
  const [showOptions, setShowOptions] = useState(false);
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

  return (
    <div
      style={{
        userSelect: "none",
        position: "absolute",
        zIndex: 8123781237812,
        top: 25,
        left: 25,
        display: "flex",
        gap: 45,
        flexWrap: "wrap",
      }}
    >
      <Options visible={showOptions} onClose={() => setShowOptions(false)} />
      <SettingOutlined onClick={() => setShowOptions(true)} />
      <Typography style={{ color: "green" }}>
        Selected:{" "}
        {selected.map((s, id) => (
          <span key={id}>
            {s.assetId}
            {s.id},{" "}
          </span>
        ))}
      </Typography>
      <Typography style={{ color: "yellowgreen" }}>Origin: {origin}</Typography>
      <Typography style={{ color: "lightblue" }}>
        Resources: {resources}
      </Typography>
      <Typography style={{ color: "white" }}>{helperUi}</Typography>
    </div>
  );
};

export default UI;
