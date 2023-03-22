import { Handle, HandleProps, Position } from "reactflow";

const getPosition = (type: HandleProps["type"]): Position => {
  return type === "source" ? Position.Right : Position.Left;
};

export function SideHandle(props: Omit<HandleProps, "position">) {
  return (
    <Handle
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
