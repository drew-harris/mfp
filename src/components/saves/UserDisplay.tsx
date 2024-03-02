import { useContext } from "react";
import { UserContext } from "../contexts/UserContext";
import { Button } from "../basic/Button";
import { sendLog } from "../../api/logs";
import { LogType } from "../../__generated__/graphql";

export default function UserDisplay() {
  const { user, logOut } = useContext(UserContext);

  if (!user) {
    return null;
  }

  const handleClick = () => {
    sendLog(LogType.MfpLogOut);
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
