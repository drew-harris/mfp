import { Handle, HandleProps, Position } from "reactflow";

const getPosition = (type: HandleProps["type"]): Position => {
  return type === "source" ? Position.Right : Position.Left;
};

export interface SideHandleProps extends Omit<HandleProps, "position"> {
  className?: string;
  label?: string;
}

export function SideHandle(props: SideHandleProps) {
  return (
    <Handle
      className={props.className}
      {...props}
      style={{
        transform: `scale(2.6)`,
        top: 0,
        display: "block",
        position: "relative",
      }}
      position={getPosition(props.type)}
    >
      <div className="-translate-x-[6px] -translate-y-[3.2px] text-[6px] text-black">
        {props.label}
      </div>
    </Handle>
  );
}
