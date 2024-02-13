import { useNodeStore } from "../../stores/nodes";
import { Button } from "../basic/Button";

export const MenuBar = () => {
  // const instance = useReactFlow();
  // const sendNotification = useNotifications((s) => s.sendNotification);
  const [infoMode, toggleInfo] = useNodeStore((r) => [
    r.infoModeEnabled,
    r.toggleInfoMode,
  ]);

  return (
    <div className="flex gap-2">
      <Button className={infoMode ? "bg-mc-200" : null} onClick={toggleInfo}>
        Info Mode: {infoMode ? "ON" : "OFF"}
      </Button>
    </div>
  );
};
