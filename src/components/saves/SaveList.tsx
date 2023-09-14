import { useQuery } from "@apollo/client";
import { gql } from "../../__generated__";
import { timeAgo } from "../../utils/timeago";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faSave } from "@fortawesome/free-solid-svg-icons";

const SAVES = gql(`
query AllSaves {
  saves {
    name
    id
    updatedAt
  }
}`);

export default function SaveList() {
  const { data } = useQuery(SAVES);
  return (
    <div className="flex flex-col gap-2">
      <div className="outset-4 flex cursor-pointer items-center justify-center gap-2 bg-mc-200 p-2 transition-all hover:py-3">
        <FontAwesomeIcon icon={faPlus} />
        <div className="font-semibold">New Save</div>
      </div>
      {data?.saves?.map((save) => {
        return (
          <div
            className="outset-4 flex cursor-pointer items-baseline justify-between bg-mc-200 p-2"
            key={save.id}
          >
            <div className="flex items-center gap-2">
              <FontAwesomeIcon icon={faSave} className="opacity-50" />
              <div className="font-semibold">{save.name}</div>
            </div>
            <div className="text-xs opacity-30">
              {timeAgo.format(new Date(save.updatedAt), "mini")}
            </div>
          </div>
        );
      })}
    </div>
  );
}
