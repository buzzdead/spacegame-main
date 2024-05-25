import "../styles/theme.css";
import { Form, Input, Select, Button, Flex } from "antd";
import {
  UserOutlined,
  HomeOutlined,
  RocketOutlined,
  SettingFilled,
  SafetyCertificateOutlined,
} from "@ant-design/icons";
import { useRef, useState } from "react";
import Checkmark from "./Checkmark";
import useStore from "../store/UseStore";
import { createJWT, decodeJWT } from "../util";


interface PlayerInfo {
    username: string;
    homebase: string;
    password: string;
    solarSystem: string;
  }

  interface Props {
    setGameStarted: (b: boolean) => void;
    setShowOptions: () => void
  }
  const SECRET_KEY = 'your_secret_key';
  const TOKEN_EXPIRY = '1h'; // Token expiry time
export const Register = ({setGameStarted, setShowOptions}: Props) => {
    const logIn = useStore((state) => state.logIn)
    const [failed, setFailed] = useState(false)
    const [registering, setRegistering] = useState(false)
    const solarSystemRef = useRef('')
    const onFinish = async (values: PlayerInfo) => {
        setRegistering(true)
        const ss = solarSystemRef.current.replaceAll(' ', '_').replaceAll('-', '_')
        try {
          const response = await fetch('/.netlify/functions/register', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              name: values.username,
              homebase: values.homebase,
              solarSystem: ss,
              password: values.password, // Replace with actual password input, bencrypt
            }),
          });
      
          if (!response.ok) {
            throw new Error(`Error: ${response.status}`);
          }
      
          const data = await response.json();
          console.log('Player created with ID:', data.id);
          logIn({name: values.username, homebase: values.homebase, solarSystem: values.solarSystem})
          const token = await createJWT({ name: values.username, homebase: values.homebase, solarSystem: values.solarSystem });
          localStorage.setItem('token', token);
   
          setFailed(false)
          setGameStarted(true);
        } catch (error) {
          console.error('Failed to create player:', error);
          onFinishFailed(error);
          if(failed) setGameStarted(true)
          else {setFailed(true); setTimeout(() => setRegistering(false), 10000)}
        }
      };
    
      const onFinishFailed = (errorInfo: any) => {
        console.error("Failed:", errorInfo);
      };
    return (
        <Form
        name="player-creation"
        style={{ gap: 20, display: "flex", flexDirection: "column" }}
        initialValues={{ username: "", homebase: "", solarSystem: "" }}
        onFinish={onFinish}
        onFinishFailed={onFinishFailed}
        layout="vertical"
      >
        <Form.Item name="username">
          <div style={{ display: "flex", flexDirection: "row" }}>
            <UserOutlined
              style={{
                color: "lightblue",
                marginRight: 8,
                position: "absolute",
                left: -25,
                top: 7.5,
              }}
            />
            <Input autoFocus placeholder="Player name" />
          </div>
        </Form.Item>
        <Form.Item name="homebase">
          <div style={{ display: "flex", flexDirection: "row" }}>
            <HomeOutlined
              style={{
                color: "lightblue",
                marginRight: 8,
                position: "absolute",
                left: -25,
                top: 7.5,
              }}
            />
            <Input placeholder="Homebase name" />
          </div>
        </Form.Item>
        <Form.Item name="password">
          <div style={{ display: "flex", flexDirection: "row" }}>
            <SafetyCertificateOutlined
              style={{
                color: "lightblue",
                marginRight: 8,
                position: "absolute",
                left: -25,
                top: 7.5,
              }}
            />
            <Input type="password" placeholder="Password" />
          </div>
        </Form.Item>
        <Form.Item name="solarSystem">
          <div style={{ display: "flex", flexDirection: "row" }}>
            <RocketOutlined
              style={{
                color: "lightblue",
                marginRight: 8,
                position: "absolute",
                left: -25,
                top: 7.5,
              }}
            />
            <Select onChange={(e) => solarSystemRef.current = e}>
              <Select.Option value="Sol">
                Sol (Our Solar System)
              </Select.Option>
              <Select.Option value="Alpha Centauri">
                Alpha Centauri
              </Select.Option>
              <Select.Option value="Kepler-186f">Kepler-186f</Select.Option>
            </Select>
          </div>
        </Form.Item>
        <Flex gap={10} dir="row">
          <Button
            type="default"
            onClick={setShowOptions}
            style={{ width: "120px", height: '40px' }}
          >
            Options
            <SettingFilled
              style={{
                color: "lightblue",
                marginRight: 8,
                pointerEvents: "none",
                position: "absolute",
                left: -32.5,
                top: 7.5,
              }}
            />
          </Button>
          <Form.Item>
            <Button
              type={failed ? "text" : "primary"}
              htmlType="submit"
              style={{ width: "120px", height: '40px' }}
            >
              {<div>{registering ? <div style={{position: 'relative', left: '25px', bottom: '2.5px'}}><Checkmark shouldComplete={failed} /></div> : "Start Game"} </div>}
            </Button>
          </Form.Item>
        </Flex>
      </Form>
    )
}