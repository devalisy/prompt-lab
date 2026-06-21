export default function CommunityLoading() {
  return (
    <main className="pt-24 pb-16 min-h-screen">
      <div className="max-w-5xl mx-auto px-4">
        <div className="flex items-center gap-3 mb-8">
          <div className="size-9 rounded-xl bg-surface-elevated animate-pulse" />
          <div>
            <div className="h-6 w-28 rounded bg-surface-elevated animate-pulse mb-1" />
            <div className="h-4 w-44 rounded bg-surface-elevated animate-pulse" />
          </div>
        </div>
        <div className="flex gap-1 mb-6 p-0.5 rounded-xl bg-surface-secondary border border-border-light">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-8 w-28 rounded-lg bg-surface-elevated animate-pulse" />
          ))}
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="rounded-xl border border-border-light bg-surface-secondary p-3.5 space-y-3 animate-pulse">
              <div className="flex items-center gap-2">
                <div className="size-6 rounded-full bg-surface-elevated" />
                <div className="h-3 w-24 rounded bg-surface-elevated" />
              </div>
              <div className="h-4 w-3/4 rounded bg-surface-elevated" />
              <div className="h-3 w-full rounded bg-surface-elevated" />
              <div className="h-3 w-1/2 rounded bg-surface-elevated" />
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
