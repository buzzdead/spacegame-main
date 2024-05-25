import { Modal, Typography, Col, Row } from "antd"
import Buttons from "./Buttons"
import Starfield from "../../startup/Starfield"
import {
    CloseCircleOutlined,
    CloseCircleTwoTone,
    CloseSquareFilled,
    CloseSquareOutlined,
    CloseOutlined,
    StarOutlined,
    FullscreenExitOutlined,
    StarFilled
  } from "@ant-design/icons";
import React, { useMemo, useState } from "react";
import { Dashboard } from "./Dashboard";
import { Guide } from "./Guide";
import { Intel } from "./Intel";

interface Props {
    onClose: () => void
    visible: boolean
}
export const gameMenuTabs = ["Dashboard", "Intel", "Guide"] as const
export type GameMenuTabs = typeof gameMenuTabs[number]

interface GameMenuTab {
    name: GameMenuTabs
    content: React.ReactNode
}

const currentGameMenutabs: GameMenuTab[] = [
    {
        name: "Dashboard",
        content: <Dashboard />
    },
    {
        name: "Guide",
        content: <Guide />
    },
    {
        name: "Intel",
        content: <Intel />
    }
]



const GameMenu = ({onClose, visible}: Props) => {
    const [currentTab, setCurrentTab] = useState<GameMenuTabs>("Dashboard") 
    const renderContent = () => {
        const tab = currentGameMenutabs.find((tab) => tab.name === currentTab);
        return tab ? tab.content : null;
      };
    const starField = useMemo(() => {
        return <Starfield inGame />
    }, [])
    return (
        <Modal
        onCancel={onClose}
        open={visible}
        footer={null}
        width={'75%'}
        style={{marginTop: 50,}}
        closeIcon={<FullscreenExitOutlined style={{color: "white", fontSize: 20, paddingTop: 30, paddingRight: 60}} />}
        styles={{content: {backgroundColor: '#011a05', opacity: 0.85,}, body: {height: "60vh",}, mask: {backgroundColor: 'rgba(30, 0, 0, 0.55)'}}}
      >
         <div style={{position: 'relative',}}>
            <div style={{position: 'absolute'}}>
        {starField}
        </div>
        </div>
        {renderContent()}
       
        <Buttons handleChange={(tab: GameMenuTabs) => setCurrentTab(tab)}/>
        </Modal>
    )
}

export default React.memo(GameMenu, (prevProps, nextProps) => {
    return prevProps.onClose !== nextProps.onClose || prevProps.visible !== nextProps.visible
})