import { SelectOption } from "./ItemPicker";
import { LogType } from "../../__generated__/graphql";
import { sendLog } from "../../api/logs";

interface TypeSelectProps {
  selected: SelectOption;
  setSelected: (option: SelectOption) => void;
}
export const PickerSelect = (props: TypeSelectProps) => {
  return (
    <select
      value={props.selected}
      onChange={(v) => {
        sendLog(LogType.MfpChangeFilter)
        return props.setSelected(v.target.value as SelectOption);
      }}
      className="inset bg-mc-300 p-2 text-white"
    >
      <option value="all">All</option>
      <option value="resource">Resource</option>
      <option value="crafter">Crafter</option>
      <option value="utility">Utility</option>
      <option value="custom">Custom</option>
    </select>
  );
};
