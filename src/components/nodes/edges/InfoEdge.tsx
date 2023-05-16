import { BaseEdge, EdgeProps, getSimpleBezierPath } from "reactflow";
import { useNodeStore } from "../../../stores/nodes";
import { MCEdge } from "../../../types/MCNodes";
import { SpriteDisplay } from "../../SpriteDisplay";

const foreignObjectSize = 80;

function CustomEdge(props: EdgeProps) {
  const {
    id,
    sourceX,
    selected,
    sourceY,
    targetX,
    targetY,
    markerEnd,
    style,
    sourcePosition,
    targetPosition,
  } = props;
  const infoMode = useNodeStore((r) => r.infoModeEnabled);
  const data = props.data as MCEdge;

  const [edgePath, labelX, labelY] = getSimpleBezierPath({
    sourceX,
    sourceY,
    targetX,
    targetY,
    sourcePosition,
    targetPosition,
  });

  if (!infoMode) {
    return (
      <BaseEdge
        style={{
          stroke: selected ? "white" : "darkgray",
          strokeWidth: 4,
          transform: "translate(0px, 0.4%)",
          ...style,
        }}
        labelX={0}
        labelY={0}
        path={edgePath}
      />
    );
  }

  // Limit decimals to 2
  const rateString = Number.isInteger(data.outputRate)
    ? data.outputRate
    : data.outputRate.toFixed(2);

  return (
    <>
      <path
        id={id}
        style={{
          stroke: selected ? "white" : "darkgray",
          strokeWidth: 4,
          transform: "translate(0px, 0.4%)",
          ...style,
        }}
        className="react-flow__edge-path"
        d={edgePath}
        markerEnd={markerEnd}
      ></path>
      <foreignObject
        width={foreignObjectSize}
        height={foreignObjectSize}
        x={labelX - foreignObjectSize / 2}
        y={labelY - foreignObjectSize / 2}
        style={{
          border: "1px solid red",
        }}
        className="edgebutton-foreignobject"
        startOffset={"15%"}
        requiredExtensions="http://www.w3.org/1999/xhtml"
      >
        <div className="translate-y-4">
          <SpriteDisplay size={28} url={data.item.imageUrl} />
          <div className="-mt-1 text-center text-white">{rateString}</div>
        </div>
      </foreignObject>
    </>
  );
}

export default CustomEdge;
