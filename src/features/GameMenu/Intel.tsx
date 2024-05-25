import { Button, Card, Col, Row, Typography } from "antd";
import "../../styles/theme.css";
import { useState } from "react";

const intelObjects = [
  {
    name: "Fighter",
    imgUrl: "/assets/fightert.png",
    description: "Combat ship",
  },
  {
    name: "Cargo",
    imgUrl: "/assets/cargoship.png",
    description: "Mining ship",
  },
  {
    name: "Cruiser",
    imgUrl: "/assets/cruiser.png",
    description: "Combat ship",
  },
];

type Selected = "Fighter" | "Cargo" | "Cruiser";

const descriptions = { Fighter:  "The fighter ship is a very effective ship at small excursions. These ships travel fast, packs a nice punch with their laser cannon and can be upgraded with missiles. The fighter ship attacks best in group with other fighter ships.",
Cargo: "The cargo ship is effective at practical tasks like mining asteroids and shipping resources. Should aim to have at least one per asteroid.", Cruiser: "The B tier of the cruiser class. These ships have a multi-targeted laser cannons that can shoot three ships at the same time. Additionally, they are equipped with a laser beam that shoots directly in front of it."
 }

export const Intel = () => {
  const [selected, setSelected] = useState<Selected | null>(null);
  const { Title, Paragraph } = Typography;
  const handleOnClick = (name: string) => {
    const newName = name as Selected;
    if (newName) {
      if (newName === selected) setSelected(null);
      else setSelected(newName);
    }
  };
  return (
    <div
      style={{
        color: "white",
        zIndex: 128931938129382,
        display: "flex",
        justifyContent: "center",
        position: "relative",
      }}
    >
      <div
        style={{
          position: "absolute",
          display: "flex",
          flexDirection: "column",
          zIndex: 1289319381293821,
          maxWidth: "65%",
        }}
      >
        <Title style={{ color: "red" }}>Intel</Title>
        {selected === null ? (
          <>
            <Title style={{ color: "white" }} level={4}>
              Ships discovered
            </Title>
            <Row gutter={[16, 16]} style={{ marginTop: 20 }}>
              {intelObjects.map((io) => {
                return (
                  <Col
                    key={io.name}
                    xs={24}
                    sm={12}
                    md={8}
                    lg={6}
                    style={{ minWidth: "200px" }}
                  >
                    <Card
                      className="custom-card"
                      onClick={() => handleOnClick(io.name)}
                      hoverable
                      cover={
                        <div
                          style={{
                            marginTop: "15px",
                            height: "50px",
                            overflow: "hidden",
                            backgroundColor: "inherit",
                          }}
                        >
                          <img
                            alt="example"
                            src={io.imgUrl}
                            style={{
                              width: "100%",
                              height: "100%",
                              objectFit: "contain",
                              backgroundColor: "inherit",
                            }}
                          />
                        </div>
                      }
                      title={io.name}
                      style={{
                        textAlign: "center",
                        color: "white",
                        backgroundColor: "#5d805d",
                      }}
                      styles={{
                        title: {
                          textAlign: "center",
                          color: "blueviolet",
                          fontWeight: "bold",
                          fontSize: 18,
                        },
                      }}
                      bordered={false}
                    >
                      {io.description}
                    </Card>
                  </Col>
                );
              })}
            </Row>
          </>
        ) : (
          <>
            <Title level={2} style={{ color: "white" }}>
              {selected}
            </Title>{" "}
            <Paragraph style={{maxWidth: '60%', color: 'white'}}>
              {descriptions[selected]}
            </Paragraph>
            <Button style={{width: '100px'}} onClick={() => setSelected(null)}>Go back</Button>
          </>
        )}
      </div>
    </div>
  );
};
