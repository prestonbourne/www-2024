

export const CloseDialog = () => {
    <button
    className="w-7 h-7 mb-2 flex items-center justify-center group" // wider so easier to click
    onClick={() => setActiveSketch(null)}
  >
    <div className="bg-red-500 rounded-full p-[1px] transition-colors text-red-900">
      <Cross2Icon className="opacity-0 group-hover:opacity-100 transition-opacity w-3 h-3" />
    </div>
  </button>
};