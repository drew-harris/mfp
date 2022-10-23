import { ReactFlowProvider } from "reactflow";
import ItemPicker from "./views/ItemPicker";
import NodeCanvas from "./views/NodeCanvas";

function App() {
  return (
    <ReactFlowProvider>
      <div className="grid grid-rows-[1.8fr_1fr] h-full absolute top-0 bottom-0 left-0 right-0 p-2 gap-2 grid-cols-[2fr_2fr_1.3fr]">
        <div className="bg-mc-300 border-4 border-mc-800 col-span-2">
          <NodeCanvas />
        </div>
        <div className="bg-mc-600  row-span-2">test2</div>
        <div className="bg-mc-600 ">
          <ItemPicker />
        </div>
        <div className="bg-mc-600 ">test4</div>
      </div>
    </ReactFlowProvider>
  );
}

export default App;
