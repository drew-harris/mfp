import { SelectOption } from "./ItemPicker";

interface TypeSelectProps {
  selected: SelectOption;
  setSelected: (option: SelectOption) => void;
}
export const PickerSelect = (props: TypeSelectProps) => {
  return (
    <select
      value={props.selected}
      onChange={(v) => props.setSelected(v.target.value as SelectOption)}
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
