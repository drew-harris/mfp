import { cva } from "cva";
import {
  FilterType,
  usePickerFilterStore,
} from "../../stores/pickerFilterStore";

interface FilterButtonProps extends React.ComponentPropsWithoutRef<"div"> {
  type: FilterType;
}

export default function FilterButton(props: FilterButtonProps) {
  const { type, ...rest } = props;
  const select = usePickerFilterStore((s) => s.toggleSwitch);
  const enabled = usePickerFilterStore(
    (s) => s.switches[type] || s.switches[FilterType.all]
  );

  let trueColor;
  let falseColor;

  switch (type) {
    case FilterType.all: {
      trueColor = "mc-200";
      falseColor = "mc-200";
      break;
    }
    case FilterType.resource: {
      trueColor = "green-300";
      falseColor = "green-400";
      break;
    }
    case FilterType.crafter: {
      trueColor = "blue-200";
      falseColor = "blue-300";
      break;
    }
    case FilterType.utility: {
      trueColor = "yellow-200";
      falseColor = "yellow-300";
      break;
    }
    default: {
      trueColor = "mc-200";
      falseColor = "mc-200";
    }
  }

  const trueColorString = `bg-${trueColor}`;
  const falseColorString = `bg-${falseColor} opacity-50`;

  const className = cva(["p-1", "outset-4", "cursor-pointer"], {
    variants: {
      enabled: {
        true: trueColorString,
        false: falseColorString,
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
