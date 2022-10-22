function App() {
  return (
    <div className="grid grid-rows-[1.8fr_1fr] h-full absolute top-0 bottom-0 left-0 right-0 p-2 gap-2 grid-cols-[2fr_2fr_1.3fr]">
      <div className="bg-mc-300 border-4 border-mc-800 col-span-2">test</div>
      <div className="bg-mc-600  row-span-2">test2</div>
      <div className="bg-mc-600 ">test3</div>
      <div className="bg-mc-600 ">test4</div>
    </div>
  );
}

export default App;
