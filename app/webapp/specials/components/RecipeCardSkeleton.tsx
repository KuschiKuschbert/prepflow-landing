export function RecipeCardSkeleton() {
  return (
    <div className="flex flex-col overflow-hidden rounded-2xl border border-[#2a2a2a] bg-[#1f1f1f] shadow-sm">
      {/* Image Placeholder */}
      <div className="relative aspect-[4/3] w-full animate-pulse bg-[#252525]">
        <div className="absolute top-3 right-3 h-6 w-16 animate-pulse rounded-full bg-[#333]" />
      </div>

      <div className="flex flex-col gap-3 p-5">
        {/* Title Placeholder */}
        <div className="h-7 w-3/4 animate-pulse rounded-md bg-[#252525]" />
        <div className="h-7 w-1/2 animate-pulse rounded-md bg-[#252525]" />

        {/* Meta Placeholder */}
        <div className="mt-2 flex items-center gap-3">
          <div className="h-4 w-4 animate-pulse rounded-full bg-[#252525]" />
          <div className="h-4 w-20 animate-pulse rounded-md bg-[#252525]" />
        </div>

        {/* Tags Placeholder */}
        <div className="mt-3 flex flex-wrap gap-2">
          <div className="h-5 w-16 animate-pulse rounded-md bg-[#252525]" />
          <div className="h-5 w-20 animate-pulse rounded-md bg-[#252525]" />
          <div className="h-5 w-12 animate-pulse rounded-md bg-[#252525]" />
        </div>
      </div>
    </div>
  );
}
