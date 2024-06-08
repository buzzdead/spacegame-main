import { Flex, Typography } from "antd";
import '../../styles/ui.css'

export const Guide = () => {
  const { Title, Paragraph } = Typography;
  function s(s: string) {
    <Title level={5} style={{ color: "red" }}></Title>;
  }
  return (
    <div
    className="container"
      style={{
        color: "white",
        zIndex: 128931938129382,
        justifyContent: "center",
        position: "relative",
      }}
    >
      
        <Title style={{ color: "red" }}>Guide</Title>
        <Paragraph>
          You can select a friendly ship by clicking{" "}
          <span>left mousebutton</span> on it, or
          holding "<span>S</span>" button and
          dragging the cursor over any number of ships.
        </Paragraph>
        <Paragraph>
          Similarily, you can deselect by{" "}
          <span>clicking</span> a{" "}
          <span style={{ fontStyle: "italic", fontWeight: 500 }}>
            selected ship
          </span>
          , or holding "<span>D</span>" button and
          dragging the cursor over any number of ships.
        </Paragraph>
        <Paragraph>
          Hold <span>left control button</span> and
          click on a ship to show information about the ship.
        </Paragraph>
        <Paragraph>
          To bind selected ships to a group, hold <span>left control button</span> and click on a digit from <span>1 to 9</span>.
          To select a group just click on a digit from <span>1 to 9.</span>
          {" "}{" "}{" "}Clicking on a digit that is not bound will deselect all ships.
          </Paragraph>
        <Paragraph>
          To move the camera, hold{" "}
          <span>right mouse button</span> and drag in
          the opposite direction, to zoom{" "}
          <span>scroll</span> in or out, rotate by
          holding <span>left mouse button</span> and
          drag in any direction.
        </Paragraph>
      </div>
  );
};
