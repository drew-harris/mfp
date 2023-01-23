import { useUpdateNodeInternals } from "reactflow";
import { MCSplitterNode } from "../../types/MCNodes";

interface SplitterNodeProps {
  data: MCSplitterNode;
}

export default function SplitterNode({ data }: SplitterNodeProps) {
  const updateNodeInternals = useUpdateNodeInternals();

  return <div>WIP</div>;

  // return (
  //   <>
  //     <div className="p-1 text-white bg-orange-300 shadow">
  //       <div className="text-center text-black">Splitter</div>
  //       <div className="flex flex-col items-center py-4 px-8 text-black bg-gray-100">
  //         {data.item && (
  //           <SpriteDisplay
  //             className="mb-5"
  //             size={56}
  //             spriteIndex={data.item.spriteIndex}
  //           />
  //         )}
  //         <div className="text-xs text-gray-400">Output Count</div>
  //         <div className="text-xs text-gray-400">{data.id}</div>
  //         <input
  //           className="pl-4 w-28 text-xs text-black bg-gray-300 rounded-xl border border-black placeholder:text-gray-600"
  //           placeholder="Ratio"
  //           value={data.ratio.length || 0}
  //           onChange={(event) => {
  //             setRatioForSplitter(data.id, parseInt(event.target.value) || 0);
  //             updateNodeInternals(data.id);
  //           }}
  //         />
  //         <Handle
  //           type="target"
  //           position={Position.Left}
  //           style={{ transform: "scale(2.6) translate(0px, -1.5px)" }}
  //         >
  //           <div className="translate-x-2 text-[4px] -translate-y-[1.2px]">
  //             {data?.item?.title}
  //           </div>
  //         </Handle>
  //         {data.ratio.map((part, index) => (
  //           <Handle
  //             id={index.toString()}
  //             key={index}
  //             type="source"
  //             position={Position.Right}
  //             style={{
  //               transform: `scale(2.6) translate(0px, ${8.5 * index - 4}px)`,
  //             }}
  //           >
  //             <div className="-translate-x-2 scale text-[4px] -translate-y-[1.2px]">
  //               {part}
  //             </div>
  //           </Handle>
  //         ))}
  //       </div>
  //     </div>
  //   </>
  // );
}
