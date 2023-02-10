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
        className="p-3"
        onChange={(e) => setInput(e.target.value)}
        placeholder="Enter your id"
      />
      <button onClick={() => updateId(input)}>Submit</button>
    </div>
  );
};
