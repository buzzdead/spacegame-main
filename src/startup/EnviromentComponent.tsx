import { Environment } from "@react-three/drei"
import useStore from "../store/UseStore"

export const EnviromentComponent = () => {
    const brightness = useStore(state => state.brightness)
    return  <Environment
        encoding={3001}
        backgroundIntensity={brightness}
        files={"./starmap-min.jpg"}
        background
      />
}