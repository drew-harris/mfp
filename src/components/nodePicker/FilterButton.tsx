import { cva } from "cva";
import { FilterType } from "../../stores/pickerFilterStore";
import { usePickerFilterStore } from "../../stores/pickerFilterStore";

interface FilterButtonProps extends React.ComponentPropsWithoutRef<"div"> {
  type: FilterType;
}

export default function FilterButton(props: FilterButtonProps) {
  const { type, ...rest } = props;
  const select = usePickerFilterStore((s) => s.toggleSwitch);
  const enabled = usePickerFilterStore(
    (s) => s.switches[type] || s.switches[FilterType.all]
  );

  const className = cva(["p-1", "outset-4", "cursor-pointer"], {
    variants: {
      enabled: {
        true: "bg-mc-200",
        false: "bg-mc-500 opacity-50",
      },
    },

    defaultVariants: {
      enabled: false,
    },
  });
  return (
    <div
      {...rest}
      className={className({ enabled })}
      onClick={() => select(type)}
    >
      <div>{type}</div>
      <div>{}</div>
    </div>
  );
}
