import { Handle, HandleProps, Position } from "reactflow";

const getPosition = (type: HandleProps["type"]): Position => {
  return type === "source" ? Position.Right : Position.Left;
};

export interface SideHandleProps extends Omit<HandleProps, "position"> {
  className?: string;
}

export function SideHandle(props: SideHandleProps) {
  return (
    <Handle
      className={props.className}
      {...props}
      style={{
        transform: `scale(2.6) translate(0px, 0px)`,
        top: 0,
        display: "block",
        position: "relative",
      }}
      position={getPosition(props.type)}
    />
  );
}
