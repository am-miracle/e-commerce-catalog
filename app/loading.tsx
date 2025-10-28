export default function Loading() {
  return (
    <main className="min-h-screen">
      <div className="container mx-auto py-6">
        <div className="mb-6">
          <div className="h-10 w-64 bg-muted/20 rounded-lg animate-pulse mb-2" />
          <div className="h-5 w-96 bg-muted/20 rounded-lg animate-pulse" />
        </div>

        <div className="flex gap-6">
          <div className="w-64 shrink-0 border-r bg-background">
            <div className="p-4 space-y-6">
              <div className="h-6 w-32 bg-muted/20 rounded animate-pulse" />

              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="space-y-3">
                  <div className="h-5 w-24 bg-muted/20 rounded animate-pulse" />
                  <div className="space-y-2">
                    {[1, 2, 3].map((j) => (
                      <div
                        key={j}
                        className="h-4 w-full bg-muted/20 rounded animate-pulse"
                      />
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between gap-4 mb-6">
              <div className="h-5 w-32 bg-muted/20 rounded animate-pulse" />
              <div className="flex items-center gap-3">
                <div className="h-10 w-48 bg-muted/20 rounded animate-pulse" />
                <div className="h-10 w-20 bg-muted/20 rounded animate-pulse" />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {Array.from({ length: 8 }).map((_, i) => (
                <div
                  key={i}
                  className="rounded-lg border bg-card overflow-hidden"
                >
                  <div className="h-[200px] bg-muted/20 animate-pulse" />
                  <div className="p-4 space-y-3">
                    <div className="h-5 bg-muted/20 rounded animate-pulse" />
                    <div className="h-4 bg-muted/20 rounded animate-pulse w-3/4" />
                    <div className="h-6 bg-muted/20 rounded animate-pulse w-1/2" />
                    <div className="h-10 bg-muted/20 rounded animate-pulse" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
