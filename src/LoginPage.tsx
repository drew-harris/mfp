import { useState } from "react";
import { useUserStore } from "./stores/userStore";

export const LoginPage = () => {
  const [input, setInput] = useState("");
  const updateId = useUserStore((s) => s.setId);

  return (
    <div className="flex flex-col p-8 max-h-screen h-[100vh]">
      <div>Login</div>
      <input
        value={input}
        className="p-3 inset"
        onChange={(e) => setInput(e.target.value)}
        placeholder="Enter your id"
      />
      <button
        className="p-3 bg-mc-100 max-w-xs mx-auto mt-8 outset mc-background"
        onClick={() => updateId(input)}
      >
        Submit
      </button>
    </div>
  );
};
