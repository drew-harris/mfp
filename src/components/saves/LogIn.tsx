import { FormEvent, useContext, useState } from "react";
import { Button } from "../basic/Button";
import { UserContext } from "../contexts/UserContext";

export default function LogIn() {
  const [usernameInput, setUsernameInput] = useState("");
  const { logIn, loading } = useContext(UserContext);

  const handleLogIn = (e: FormEvent) => {
    e.preventDefault();
    logIn(usernameInput);
    setUsernameInput("");
  };

  return (
    <form onSubmit={handleLogIn} className="flex flex-col items-center gap-3">
      <div className="text-center">You are not logged in.</div>
      <input
        disabled={loading}
        className="inset w-full min-w-0 bg-mc-400 p-1 text-white placeholder:text-mc-100/60 disabled:opacity-50"
        placeholder="Minecraft Username..."
        value={usernameInput}
        onChange={(e) => setUsernameInput(e.target.value)}
      ></input>
      <Button
        disabled={loading}
        type="submit"
        className="self-end disabled:opacity-50"
      >
        Log In
      </Button>
    </form>
  );
}
