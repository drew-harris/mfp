import { Handle, Position, useUpdateNodeInternals } from "reactflow";
import { useStore } from "zustand";
import { nodeStore } from "../../stores/nodes";
import { MCSplitterNode } from "../../types/MCNodes";
import { SpriteDisplay } from "../SpriteDisplay";

interface SplitterNodeProps {
  data: MCSplitterNode;
}

export default function SplitterNode({ data }: SplitterNodeProps) {
  const setRatioForSplitter = useStore(
    nodeStore,
    (store) => store.setRatioForSplitter
  );
  const updateNodeInternals = useUpdateNodeInternals();
  return (
    <>
      <div className="p-1 bg-cyan-300  shadow  text-white">
        <div className="text-black text-center">Splitter</div>
        <div className="bg-gray-100 px-8 py-4  text-black flex items-center flex-col">
          {data.item && (
            <SpriteDisplay
              className="mb-5"
              size={56}
              spriteIndex={data.item.spriteIndex}
            />
          )}
          <div className="text-gray-400 text-xs">Output Count</div>
          <input
            className="w-28 border text-xs pl-4 text-black placeholder:text-gray-600 bg-gray-300 border-black rounded-xl"
            placeholder="Ratio"
            value={data.ratio.length || 0}
            onChange={(event) => {
              setRatioForSplitter(data.id, parseInt(event.target.value) || 0);
              updateNodeInternals(data.id);
            }}
          />
          <Handle
            type="target"
            position={Position.Left}
            style={{ transform: "scale(2.6) translate(0px, -1.5px)" }}
          >
            <div className="text-[4px] translate-x-2 -translate-y-[1.2px]">
              {data?.item?.title}
            </div>
          </Handle>
          {data.ratio.map((part, index) => {
            updateNodeInternals(data.id);
            return (
              <Handle
                id={index.toString()}
                key={index}
                type="source"
                position={Position.Right}
                style={{
                  transform: `scale(2.6) translate(0px, ${8.5 * index - 4}px)`,
                }}
              >
                <div className="scale text-[4px] -translate-x-2 -translate-y-[1.2px]">
                  {part}
                </div>
              </Handle>
            );
          })}
        </div>
      </div>
    </>
  );
}
