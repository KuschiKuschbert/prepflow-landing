
export function RecipeCardSkeleton() {
  return (
    <div className="flex flex-col overflow-hidden rounded-2xl border border-[#2a2a2a] bg-[#1f1f1f] shadow-sm">
      {/* Image Placeholder */}
      <div className="relative aspect-[4/3] w-full bg-[#252525] animate-pulse">
        <div className="absolute top-3 right-3 h-6 w-16 bg-[#333] rounded-full animate-pulse" />
      </div>

      <div className="flex flex-col gap-3 p-5">
        {/* Title Placeholder */}
        <div className="h-7 w-3/4 bg-[#252525] rounded-md animate-pulse" />
        <div className="h-7 w-1/2 bg-[#252525] rounded-md animate-pulse" />

        {/* Meta Placeholder */}
        <div className="flex items-center gap-3 mt-2">
           <div className="h-4 w-4 bg-[#252525] rounded-full animate-pulse" />
           <div className="h-4 w-20 bg-[#252525] rounded-md animate-pulse" />
        </div>

        {/* Tags Placeholder */}
        <div className="mt-3 flex flex-wrap gap-2">
            <div className="h-5 w-16 bg-[#252525] rounded-md animate-pulse" />
            <div className="h-5 w-20 bg-[#252525] rounded-md animate-pulse" />
            <div className="h-5 w-12 bg-[#252525] rounded-md animate-pulse" />
        </div>
      </div>
    </div>
  );
}
