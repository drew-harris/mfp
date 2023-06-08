import { useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import FactoryPlanner from "./FactoryPlanner";
import { LoginPage } from "./LoginPage";
import { useUserStore } from "./stores/userStore";

export default function App() {
  const [searchParams] = useSearchParams();
  const userId = useUserStore((s) => s.id);
  const setUserId = useUserStore((s) => s.setId);

  // BAD PRACTICE :)
  useMemo(() => {
    if (searchParams.has("id")) {
      setUserId(searchParams.get("id"));
    }
  }, [searchParams, setUserId]);

  if (userId) {
    return <FactoryPlanner />;
  } else {
    return <LoginPage />;
  }
}
