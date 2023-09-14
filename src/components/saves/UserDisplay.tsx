import { useContext } from "react";
import { UserContext } from "../contexts/UserContext";
import { Button } from "../basic/Button";

export default function UserDisplay() {
  const { user, logOut } = useContext(UserContext);

  if (!user) {
    return null;
  }

  return (
    <div className="flex items-center justify-center gap-6 p-2">
      <img
        className="transition-all"
        src={`https://crafatar.com/renders/body/${user.id}?scale=3`}
      />
      <div className="flex flex-col gap-2 opacity-75">
        <div className="text-lg font-bold">{user.name}</div>
        <Button className="group opacity-80" onClick={logOut}>
          Log Out
        </Button>
      </div>
    </div>
  );
}
