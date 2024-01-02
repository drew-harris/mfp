import { useContext } from "react";
import { UserContext } from "../contexts/UserContext";
import { Button } from "../basic/Button";

export default function UserDisplay() {
  const { user, logOut } = useContext(UserContext);

  if (!user) {
    return null;
  }

  return (
    <div className="p-2">
      <div className="text-center text-lg">Logged in as: {user.name}</div>
      <div className="p-2" />
      <Button className="group m-auto block opacity-80" onClick={logOut}>
        Log Out
      </Button>
    </div>
  );
}
