import { useState } from "react";
import { useShallowStore } from "../store/UseStore";
import { Checkbox, Modal } from "antd";

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
        styles={{body: {height: 100}}}
      >
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
      </Modal>
  )
}