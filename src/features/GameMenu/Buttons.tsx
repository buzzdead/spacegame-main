import React, { useState } from "react";
import { TinyColor } from "@ctrl/tinycolor";
import { Button, ConfigProvider, Flex, Space } from "antd";
import { Virtuoso } from "react-virtuoso";
import Starfield from "../../startup/Starfield";
import { gameMenuTabs, GameMenuTabs } from "./GameMenu";

const colors1 = ["#6253E1", "#04BEFE"];
const colors2 = ["#fc6076", "#ff9a44", "#ef9d43", "#e75516"];
const colors3 = ["#40e495", "#30dd8a", "#2bb673"];
const getHoverColors = (colors: string[]) =>
  colors.map((color) => new TinyColor(color).lighten(10).toString());
const getActiveColors = (colors: string[]) =>
  colors.map((color) => new TinyColor(color).darken(10).toString());

interface Props {
  handleChange: (tab: GameMenuTabs) => void
}

const Buttons = ({handleChange}: Props) => {

  const [selected, setSelected] =
    useState<GameMenuTabs>("Dashboard");
    const handleOnClick = (button: any) => {
        const b = button?.target?.innerText as GameMenuTabs
        b && handleChange(b)
        setSelected(b ? b : "Dashboard");
      };
  return (
    <div style={{width: '100%', height: '100%', paddingTop: 30, paddingLeft: 15}}>
      <ConfigProvider
        theme={{
          components: {
            Button: {
              colorPrimary: `linear-gradient(135deg, ${colors2.join(", ")})`,
              colorPrimaryHover: `linear-gradient(135deg, ${getHoverColors(
                colors2
              ).join(", ")})`,
              colorPrimaryActive: `linear-gradient(135deg, ${getActiveColors(
                colors2
              ).join(", ")})`,
              lineWidth: 0,
            },
          },
        }}
      >
        <Virtuoso
          data={gameMenuTabs}
          itemContent={(index, button) => (
            <Button
              onClick={handleOnClick}
              key={button}
              style={{margin: 5, color: selected === button ? "white" : 'grey', fontWeight: 'bold', minWidth: '120px' }}
              type="primary"
              size="large"
            >
              {button}
            </Button>
          )}
        />
      </ConfigProvider>
      </div>
  );
};

export default Buttons;
