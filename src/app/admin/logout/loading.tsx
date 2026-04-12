// src/app/admin/loading.tsx
export default function Loading() {
  return (
    <div className="p-6 space-y-8">
      {/* Simple admin dashboard skeleton */}
      <div className="h-10 w-64 bg-gray-200 rounded-lg animate-pulse" />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {Array.from({ length: 4 }).map((_, i) => (
          <div
            key={i}
            className="h-32 bg-gray-200 rounded-xl animate-pulse"
          />
        ))}
      </div>

      <div className="h-64 bg-gray-200 rounded-xl animate-pulse" />
    </div>
  );
}