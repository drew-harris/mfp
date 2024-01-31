import { useContext, useEffect, useState } from "react";
import { useNotifications } from "../../stores/notifications";
import { useNodeStore } from "../../stores/nodes";
import { strictCompare } from "../../utils/comparison";

export const WorkSavedBar = () => {
  const { sendNotification } = useNotifications();
  const { lastSave, lastTimeSaved, unsavedNotifSent, setNotifSentTrue } = useNodeStore();
  const currentState = useNodeStore(
    (s) => ({ nodes: s.nodes, edges: s.edges }), strictCompare
  );
  const workSaved = strictCompare(lastSave, currentState);

  window.addEventListener('beforeunload', (event) => {
    if (!workSaved) {
      event.preventDefault();
      event.returnValue = true;
    }
  });

  const [timeSinceLastSave, setTime] = useState(0);
  const minutesUntilNotif = 5; //in minutes

  useEffect(() => {
    if (timeSinceLastSave >= minutesUntilNotif * 60_000 && !unsavedNotifSent) {
      sendNotification("You haven't saved for give minutes!", "default");
      setNotifSentTrue();
    }
  }, [lastTimeSaved, timeSinceLastSave, unsavedNotifSent]);

  const updateInterval = 1000;

  useEffect(() => {
    const interval =
      setInterval(() => setTime(Date.now() - lastTimeSaved.getTime()), updateInterval);
    return () => {
      clearInterval(interval);
    };
  }, []);

  return (
    <div className="flex gap-2">
      <div className="debug">
        Work Saved: {workSaved ? "true" : "false"} |
        Time Since Last Save: {timeSinceLastSave}
      </div>
    </div>
  );
};
