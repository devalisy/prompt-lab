export default function CategoryLoading() {
  return (
    <main className="pt-24 pb-16 min-h-screen">
      <div className="max-w-5xl mx-auto px-4">
        <div className="flex items-center gap-3 mb-8">
          <div className="size-9 rounded-xl bg-surface-elevated animate-pulse" />
          <div>
            <div className="h-6 w-36 rounded bg-surface-elevated animate-pulse mb-1" />
            <div className="h-4 w-56 rounded bg-surface-elevated animate-pulse" />
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="rounded-xl border border-border-light bg-surface-secondary p-3.5 space-y-3 animate-pulse">
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
