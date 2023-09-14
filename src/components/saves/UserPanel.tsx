import { useContext } from "react";
import { UserContext } from "../contexts/UserContext";
import LogIn from "./LogIn";
import UserDisplay from "./UserDisplay";
import SaveList from "./SaveList";

function UserPanel() {
  const { user } = useContext(UserContext);

  if (user) {
    return (
      <div className="flex h-full flex-col justify-between">
        <SaveList />
        <UserDisplay />
      </div>
    );
  } else {
    return <LogIn />;
  }
}

export default UserPanel;
