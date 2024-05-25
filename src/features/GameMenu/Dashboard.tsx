import { useShallowStore } from "../../store/UseStore";
import { Typography } from "antd";

export const Dashboard = () => {
  const { resources, user } = useShallowStore(["resources", "user"]);
  return (
    <div
      style={{
        color: "white",
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
        }}
      >
        <Typography.Title style={{ color: "red" }}>
          {user.solarSystem.replaceAll("_", " ") || "huhu"}
        </Typography.Title>
        <Typography.Title level={2} style={{ color: "white" }}>
          {user.name} of {user.homebase}{" "}
        </Typography.Title>
        <Typography.Title level={3} style={{ color: "white" }}>
          Current resources: {resources}
        </Typography.Title>
      </div>
    </div>
  );
};
