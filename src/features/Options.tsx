import { useState } from "react";
import { useShallowStore } from "../store/UseStore";
import { Checkbox, Modal } from "antd";

interface Props {
    onClose: () => void
    visible: boolean
}

export const Options = ({onClose, visible}: Props) => {
    const { postProcessing, setPostProcessing } = useShallowStore([
        "postProcessing",
        "setPostProcessing",
      ]);
    const [enablePostprocessing, setEnablePostProcessing] =
    useState(postProcessing);

  const handleModalOk = () => {
    if (postProcessing !== enablePostprocessing) setPostProcessing();
    onClose();
  };
  return (
    <Modal
        onCancel={onClose}
        onOk={handleModalOk}
        visible={visible}
        bodyStyle={{height: 100}}
      >
        <Checkbox
          onClick={() => setEnablePostProcessing(!enablePostprocessing)}
          checked={enablePostprocessing}
        >
          <p style={{userSelect: 'none'}}>Postprocessing enabled (may degrade performance)</p>
        </Checkbox>
      </Modal>
  )
}