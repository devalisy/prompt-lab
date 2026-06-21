export default function DashboardLoading() {
  return (
    <main className="pt-24 pb-16 min-h-screen">
      <div className="max-w-5xl mx-auto px-4">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <div className="size-10 rounded-xl bg-surface-elevated animate-pulse" />
            <div>
              <div className="h-6 w-36 rounded bg-surface-elevated animate-pulse mb-1" />
              <div className="h-4 w-48 rounded bg-surface-elevated animate-pulse" />
            </div>
          </div>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-8">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="rounded-xl border border-border-light bg-surface-secondary p-4 text-center">
              <div className="size-8 rounded-lg bg-surface-elevated animate-pulse mx-auto mb-2.5" />
              <div className="h-5 w-12 rounded bg-surface-elevated animate-pulse mx-auto mb-1" />
              <div className="h-3 w-20 rounded bg-surface-elevated animate-pulse mx-auto" />
            </div>
          ))}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {[1, 2].map((i) => (
            <div key={i} className="rounded-xl border border-border-light bg-surface-secondary p-4">
              <div className="h-4 w-28 rounded bg-surface-elevated animate-pulse mb-4" />
              {[1, 2, 3].map((j) => (
                <div key={j} className="h-8 rounded bg-surface-elevated animate-pulse mb-2" />
              ))}
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
