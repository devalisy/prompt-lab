export default function PromptDetailLoading() {
  return (
    <main className="pt-24 pb-16 min-h-screen">
      <div className="max-w-4xl mx-auto px-4">
        <div className="h-4 w-24 rounded bg-surface-elevated animate-pulse mb-6" />
        <div className="rounded-xl border border-border-light bg-surface-secondary p-5 space-y-4">
          <div className="flex items-start justify-between">
            <div className="space-y-2 flex-1">
              <div className="h-6 w-3/4 rounded bg-surface-elevated animate-pulse" />
              <div className="flex gap-2">
                <div className="h-5 w-16 rounded-md bg-surface-elevated animate-pulse" />
                <div className="h-5 w-20 rounded-md bg-surface-elevated animate-pulse" />
              </div>
            </div>
            <div className="h-8 w-20 rounded-lg bg-surface-elevated animate-pulse" />
          </div>
          <div className="space-y-2">
            <div className="h-4 w-full rounded bg-surface-elevated animate-pulse" />
            <div className="h-4 w-full rounded bg-surface-elevated animate-pulse" />
            <div className="h-4 w-2/3 rounded bg-surface-elevated animate-pulse" />
          </div>
          <div className="flex gap-2">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-9 flex-1 rounded-xl bg-surface-elevated animate-pulse" />
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}
