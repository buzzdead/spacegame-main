import { useState } from "react";
import { useShallowStore } from "../store/UseStore";
import { Checkbox, Flex, Modal, Typography } from "antd";

interface Props {
    onClose: () => void
    visible: boolean
}

export const Options = ({onClose, visible}: Props) => {
    const { postProcessing, setPostProcessing, developerMode, setDeveloperMode, setResources } = useShallowStore([
        "postProcessing",
        "setPostProcessing",
        "developerMode",
        "setDeveloperMode",
        "setResources"
      ]);
      
    const [enablePostprocessing, setEnablePostProcessing] =
    useState(postProcessing);
    const [enableDeveloperMode, setEnableDeveloperMode] = useState(developerMode)

  const handleModalOk = () => {
    if (postProcessing !== enablePostprocessing) setPostProcessing();
    if (developerMode !== enableDeveloperMode) setDeveloperMode()
    if (enableDeveloperMode) setResources(9999999999)
    onClose();
  };
  return (
    <Modal
        onCancel={onClose}
        onOk={handleModalOk}
        open={visible}
        styles={{body: {height: 400}}}
      >
        <Typography style={{marginBottom: 5, fontWeight: 'bold'}}>Options</Typography>
        <Checkbox
          disabled
          onClick={() => setEnablePostProcessing(!enablePostprocessing)}
          checked={enablePostprocessing}
        >
          <p style={{userSelect: 'none', textDecoration: 'line-through'}}>Postprocessing enabled (may degrade performance)</p>
        </Checkbox>
        <Checkbox onClick={() => setEnableDeveloperMode(!enableDeveloperMode)}>
        <p style={{userSelect: 'none'}}>Developer mode enabled (restart required)</p>
        </Checkbox>
        <Typography style={{marginBottom: 5, fontWeight: 'bold'}}>Info</Typography>
        <Flex style={{flexDirection: 'column', gap: 15}}>
        <Typography>You can select a friendly ship by clicking mousebutton on it, or holding S button and dragging mouse over any number of ships.</Typography>
        <Typography>Similarily, you can deselect by clicking a selected ship, or holding D button and dragging mouse over any number of ships</Typography>
        <Typography>Hold control (ctrl button) and click on a ship to show information about the ship</Typography>
        <Typography>To move the camera, hold right button and drag in the opposite direction, to zoom scroll, rotate by holding left button.</Typography>
        </Flex>
      </Modal>
  )
}