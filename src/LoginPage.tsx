import { useState } from "react";
import { useUserStore } from "./stores/userStore";

export const LoginPage = () => {
  const [input, setInput] = useState("");
  const updateId = useUserStore((s) => s.setId);

  return (
    <div className="flex h-[100vh] max-h-screen flex-col items-center p-8">
      <div className="mb-12 text-center text-3xl font-bold text-white">
        Login
      </div>
      <input
        value={input}
        className="inset block w-full max-w-sm p-3"
        onChange={(e) => setInput(e.target.value)}
        placeholder="Enter your id"
      />
      <button
        className="outset mc-background mt-2 block w-full max-w-sm bg-mc-100 p-3"
        onClick={() => updateId(input)}
      >
        Submit
      </button>
    </div>
  );
};
