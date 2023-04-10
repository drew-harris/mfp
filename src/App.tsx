import FactoryPlanner from "./FactoryPlanner";
import { LoginPage } from "./LoginPage";
import { useUserStore } from "./stores/userStore";
import { pullMFPData, pushMFPData } from "./utils/gqlqueries";

export default function App() {
  const userId = useUserStore((s) => s.id);
  if (userId) {
    pullMFPData(userId);
    return <FactoryPlanner />;
  } else {
    return <LoginPage />;
  }
}
