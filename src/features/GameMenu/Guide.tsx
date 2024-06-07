import { Flex, Typography } from "antd";

export const Guide = () => {
  const { Title, Paragraph } = Typography;
  function s(s: string) {
    <Title level={5} style={{ color: "red" }}></Title>;
  }
  return (
    <div
      style={{
        color: "white",
        zIndex: 128931938129382,
        justifyContent: "center",
        position: "relative",
      }}
    >
      
        <Title style={{ color: "red" }}>Guide</Title>
        <Paragraph style={{ color: "white", fontSize: 16 }}>
          You can select a friendly ship by clicking{" "}
          <span style={{ color: "green" }}>left mousebutton</span> on it, or
          holding "<span style={{ color: "green" }}>S</span>" button and
          dragging the cursor over any number of ships.
        </Paragraph>
        <Paragraph style={{ color: "white", fontSize: 16 }}>
          Similarily, you can deselect by{" "}
          <span style={{ color: "green" }}>clicking</span> a{" "}
          <span style={{ fontStyle: "italic", fontWeight: 500 }}>
            selected ship
          </span>
          , or holding "<span style={{ color: "green" }}>D</span>" button and
          dragging the cursor over any number of ships.
        </Paragraph>
        <Paragraph style={{ color: "white", fontSize: 16 }}>
          Hold <span style={{ color: "green" }}>ctrl button</span> (control) and
          click on a ship to show information about the ship.
        </Paragraph>
        <Paragraph style={{ color: "white", fontSize: 16 }}>
          To move the camera, hold{" "}
          <span style={{ color: "green" }}>right mouse button</span> and drag in
          the opposite direction, to zoom{" "}
          <span style={{ color: "green" }}>scroll</span> in or out, rotate by
          holding <span style={{ color: "green" }}>left mouse button</span> and
          drag in any direction.
        </Paragraph>
      </div>
  );
};
