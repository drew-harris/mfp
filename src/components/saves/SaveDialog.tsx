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

export default function SaveDialog({
  refetch,
}: {
  refetch: SaveListRefetchFn;
}) {
  const [active, setActive] = useState(false);
  const [saveName, setSaveName] = useState("");
  const { sendNotification } = useNotifications();
  const { user } = useContext(UserContext);
  const [saveMutation] = useMutation(CREATE_NEW_SAVE, {
    onCompleted() {
      sendNotification("Saved!", "success");
      refetch();
      setActive(false);
      setSaveName("");
    },
  });

  const submit = (e: FormEvent) => {
    e.preventDefault();
    // Get the save data
    const state = useNodeStore.getState();
    console.log("USER", user);

    if (state.nodes.length === 0) {
      sendNotification("Can't save empty graph", "error");
    }

    saveMutation({
      variables: {
        newSave: {
          playerId: user.id,
          name: saveName,
          graphData: {
            nodes: state.nodes,
            edges: state.edges,
          },
        },
      },
    });
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
          <div className="font-semibold">Save</div>
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
          <div className="font-semibold">New Save</div>
        </button>
      )}
    </div>
  );
}
