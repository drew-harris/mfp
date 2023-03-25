import { useState } from "react";
import { useUserStore } from "./stores/userStore";

export const LoginPage = () => {
  const [input, setInput] = useState("");
  const updateId = useUserStore((s) => s.setId);

  return (
    <div className="flex h-[100vh] max-h-screen flex-col p-8">
      <div>Login</div>
      <input
        value={input}
        className="inset p-3"
        onChange={(e) => setInput(e.target.value)}
        placeholder="Enter your id"
      />
      <button
        className="outset mc-background mx-auto mt-8 max-w-xs bg-mc-100 p-3"
        onClick={() => updateId(input)}
      >
        Submit
      </button>
    </div>
  );
};
