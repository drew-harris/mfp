import { useContext } from "react";
import { UserContext } from "../contexts/UserContext";
import { Button } from "../basic/Button";
import { sendLog } from "../../api/logs";
import { LogType } from "../../__generated__/graphql";
import { useObjectiveStore } from "../../stores/objectiveStore";

export default function UserDisplay() {
  const { user, logOut } = useContext(UserContext);
  const currentTask = useObjectiveStore((s) => s.currentTask)?.id;

  if (!user) {
    return null;
  }

  const handleClick = () => {
    sendLog(LogType.MfpLogOut, {task: currentTask});
    logOut();
  }

  return (
    <div className="p-2">
        <div className="text-lg text-center">Logged in as: {user.name}</div>
      <div className="p-1"/>
        <Button className="group block m-auto opacity-80" onClick={handleClick}>
          Log Out
        </Button>
      </div>
  );
}
