import { useMutation } from "@apollo/client";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { cx } from "cva";
import { FormEvent, useContext, useState } from "react";
import { CREATE_NEW_SAVE } from "../../api/saves";
import { useNodeStore } from "../../stores/nodes";
import { useNotifications } from "../../stores/notifications";
import { UserContext } from "../contexts/UserContext";
import { SaveListRefetchFn } from "./SaveList";
import { LogType } from "../../__generated__/graphql";
import { sendLog } from "../../api/logs";
import { useObjectiveStore } from "../../stores/objectiveStore";

export default function SaveDialog({ refetch, numDefaultSaves }: {
  refetch: SaveListRefetchFn;
  numDefaultSaves: number
}) {
  const [active, setActive] = useState(false);
  const [saveName, setSaveName] = useState("");
  const { sendNotification } = useNotifications();
  const { user } = useContext(UserContext);
  const currentTask = useObjectiveStore((s) => s.currentTask)?.id;
  const [saveMutation] = useMutation(CREATE_NEW_SAVE, {
    onCompleted() {
      sendLog(LogType.MfpCreateSave, {task: currentTask})
      sendNotification("Saved!", "success");
      refetch();
      setActive(false);
      setSaveName("");
    }
  });

  const submit = (e: FormEvent) => {
    e.preventDefault();
    // Get the save data
    const state = useNodeStore.getState();
    console.log("USER", user);
    console.log("numDefaultSaves:", numDefaultSaves)

    if (state.nodes.length === 0) {
      sendNotification("Can't save empty graph", "error");
    } else {
      saveMutation({
        variables: {
          newSave: {
            playerId: user.id,
            name: saveName || ("Save " + (numDefaultSaves + 1)),
            graphData: {
              nodes: state.nodes,
              edges: state.edges
            }
          }
        }
      });
    }
  };

  return (
    <div className="flex flex-col gap-1 transition-all">
      {active && (
        <form onSubmit={submit}>
          <input
            autoFocus
            className="w-full rounded-none bg-mc-100 p-1 text-black outline-none ring-0 placeholder:text-mc-400 "
            value={saveName}
            onChange={(e) => setSaveName(e.target.value)}
            placeholder="Name..."
          />
        </form>
      )}
      {active ? (
        <button
          onClick={submit}
          className={cx(
            "outset-4 flex w-full cursor-pointer items-center justify-center gap-2 bg-mc-200 hover:bg-mc-100",
            !active && "p-2"
          )}
        >
          <div className="font-semibold">Create Save</div>
        </button>
      ) : (
        <button
          onClick={() => setActive(true)}
          className={cx(
            "outset-4 flex w-full cursor-pointer items-center justify-center gap-2 bg-mc-200 hover:bg-mc-100",
            !active && "p-2"
          )}
        >
          {!active && <FontAwesomeIcon icon={faPlus} />}
          <div className="font-bold text-lg">Create New Save</div>
        </button>
      )}
    </div>
  );
}
