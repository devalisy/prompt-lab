export default function AdminLoading() {
  return (
    <main className="pt-24 pb-16 min-h-screen">
      <div className="max-w-6xl mx-auto px-4">
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-1">
            <div className="size-10 rounded-xl bg-surface-elevated animate-pulse" />
            <div>
              <div className="h-6 w-40 rounded bg-surface-elevated animate-pulse mb-1" />
              <div className="h-4 w-56 rounded bg-surface-elevated animate-pulse" />
            </div>
          </div>
        </div>
        <div className="flex gap-1 mb-6 p-0.5 rounded-xl bg-surface-secondary border border-border-light">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-8 w-24 rounded-lg bg-surface-elevated animate-pulse" />
          ))}
        </div>
        <div className="text-center py-20">
          <div className="size-8 border-2 border-accent border-t-transparent rounded-full animate-spin mx-auto mb-3" />
          <p className="text-sm text-text-muted">جاري التحميل...</p>
        </div>
      </div>
    </main>
  );
}
