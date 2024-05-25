import { Card, Col, Row, Typography } from "antd";
import '../../styles/theme.css'

const intelObjects = [
  {name: "Fighter", imgUrl: '/assets/fightert.png', description: "Combat ship"},
  {name: "Cargo", imgUrl: '/assets/cargoship.png', description: "Mining ship"},
  {name: "Cruiser", imgUrl: '/assets/cruiser.png', description: 'Combat ship'}
]

export const Intel = () => {
    const { Title, Paragraph } = Typography
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
              maxWidth: '65%'
            }}
          >
            <Title style={{ color: "red" }}>
              Intel
            </Title>
            <Title style={{color: 'white'}} level={4}>Ships discovered</Title>
            <Row gutter={[16, 16]} style={{marginTop: 20 }}>
              {intelObjects.map(io =>{
                return (
                  <Col xs={24} sm={12} md={8} lg={6} style={{minWidth: '200px'}}>
                  <Card
                  className="custom-card" 
                  hoverable
                    cover={
                      <div style={{marginTop: '15px', height: '50px', overflow: 'hidden', backgroundColor: 'inherit' }}>
                        <img 
                          alt="example" 
                          src={io.imgUrl} 
                          style={{width: '100%', height: '100%', objectFit: 'contain', backgroundColor: 'inherit'}} 
                        />
                      </div>
                    } 
                    title={io.name}
                    style={{textAlign: 'center', color: 'white', backgroundColor: '#5d805d'}}
                    styles={{title: {textAlign: 'center', color: 'blueviolet', fontWeight: 'bold', fontSize: 18}}}
                    bordered={false}
                  >
                    {io.description}
                  </Card>
                </Col>
                )
              })}
            
            </Row>
          </div>
        </div>
      );
}