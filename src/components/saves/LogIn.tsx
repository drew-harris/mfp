import { FormEvent, useContext, useState } from "react";
import { Button } from "../basic/Button";
import { UserContext } from "../contexts/UserContext";
import { sendLog } from "../../api/logs";
import { LogType } from "../../__generated__/graphql";
import { useObjectiveStore } from "../../stores/objectiveStore";

export default function LogIn() {
  const [codeInput, setCodeInput] = useState("");
  const { logIn, loading } = useContext(UserContext);
  const currentTask = useObjectiveStore((s) => s.currentTask)?.id;

  const handleLogIn = (e: FormEvent) => {
    e.preventDefault();
    logIn(codeInput);
    setCodeInput("");
    sendLog(LogType.MfpLogIn, {task: currentTask});
  };

  return (
    <form onSubmit={handleLogIn} className="flex flex-col items-center gap-3">
      <div className="text-center">You are not logged in.</div>
      <input
        disabled={loading}
        className="inset w-full min-w-0 bg-mc-400 p-1 text-white placeholder:text-mc-100/60 disabled:opacity-50"
        placeholder="Player code..."
        value={codeInput}
        onChange={(e) => setCodeInput(e.target.value)}
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
