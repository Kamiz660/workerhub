import { WorkerCard } from "@/components/workers/worker-card";
import type { Worker } from "@/lib/types";

interface WorkerGridProps {
  workers: Worker[];
}

export function WorkerGrid({ workers }: WorkerGridProps) {
  if (workers.length === 0) {
    return (
      <div className="text-center py-16">
        <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gray-100 flex items-center justify-center">
          <span className="text-2xl">🔍</span>
        </div>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          No workers found
        </h3>
        <p className="text-gray-500 text-sm max-w-sm mx-auto">
          Try adjusting your search or filters to find what you&apos;re looking for.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
      {workers.map((worker) => (
        <WorkerCard key={worker.id} worker={worker} />
      ))}
    </div>
  );
}
