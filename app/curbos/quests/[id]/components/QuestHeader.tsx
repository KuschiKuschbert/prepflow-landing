export function QuestHeader() {
    return (
        <div className="sticky top-0 z-50 backdrop-blur-md bg-black/30 border-b border-white/5 p-4 mb-8">
            <div className="max-w-4xl mx-auto flex justify-between items-center">
                 <h1 className="text-2xl font-black tracking-tighter">CURB<span className="text-[#ccff00]">OS</span> <span className="text-sm font-normal text-neutral-400 tracking-normal opacity-70">OFFICIAL PASSPORT</span></h1>
                 <div className="text-xs font-mono text-[#ccff00] border border-[#ccff00] px-2 py-1 rounded">
                     VALID
                 </div>
            </div>
        </div>
    );
}
