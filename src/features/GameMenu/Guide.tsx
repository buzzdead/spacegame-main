import { Typography } from "antd";
import '../../styles/ui.css';

export const Guide = () => {
  const { Title, Paragraph } = Typography;

  return (
    <div className="container" style={containerStyle}>
      <Title style={titleStyle}>Guide</Title>
      <Paragraph>
        You can select a friendly ship by clicking <span>left mouse button</span> on it, or holding "<span>S</span>" button and dragging the cursor over any number of ships.
      </Paragraph>
      <Paragraph>
        Similarly, you can deselect by <span>clicking</span> a <span style={italicBoldStyle}>selected ship</span>, or holding "<span>D</span>" button and dragging the cursor over any number of ships.
      </Paragraph>
      <Paragraph>
        Hold <span>left control button</span> and click on a ship to show information about the ship.
      </Paragraph>
      <Paragraph>
        To bind selected ships to a group, hold <span>left control button</span> and click on a digit from <span>1 to 9</span>. To select a group just click on a digit from <span>1 to 9</span>. Clicking on a digit that is not bound will deselect all ships.
      </Paragraph>
      <Paragraph>
        To move the camera, hold <span>right mouse button</span> and drag in the opposite direction, to zoom <span>scroll</span> in or out, rotate by holding <span>left mouse button</span> and drag in any direction.
      </Paragraph>
    </div>
  );
};

const containerStyle = {
  color: "white",
  zIndex: 128931938129382,
  justifyContent: "center",
};

const titleStyle = {
  color: "red",
};

const italicBoldStyle = {
  fontStyle: "italic",
  fontWeight: 500,
};
