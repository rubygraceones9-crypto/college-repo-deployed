import React from 'react';

export function DashboardSkeleton() {
  return (
    <div className="space-y-6 animate-pulse">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {[...new Array(4)].map((_, i) => (
          <div
            key={i}
            className="bg-gray-200 dark:bg-gray-700 rounded-xl h-32"
          />
        ))}
      </div>

      {/* Chart Section */}
      <div className="bg-gray-200 dark:bg-gray-700 rounded-xl h-64" />

      {/* Table Section */}
      <div className="space-y-2">
        <div className="bg-gray-200 dark:bg-gray-700 rounded-xl h-12" />
        {[...new Array(5)].map((_, i) => (
          <div
            key={i}
            className="bg-gray-200 dark:bg-gray-700 rounded-xl h-8"
          />
        ))}
      </div>
    </div>
  );
}

export function TableSkeleton() {
  return (
    <div className="space-y-2 animate-pulse">
      <div className="bg-gray-200 dark:bg-gray-700 rounded-lg h-12" />
      {[...new Array(8)].map((_, i) => (
        <div key={i} className="bg-gray-200 dark:bg-gray-700 rounded-lg h-8" />
      ))}
    </div>
  );
}

export function ChartSkeleton() {
  return (
    <div className="w-full h-64 bg-gray-200 dark:bg-gray-700 rounded-xl animate-pulse" />
  );
}

export function CardSkeleton() {
  return (
    <div className="space-y-3 animate-pulse">
      <div className="bg-gray-200 dark:bg-gray-700 rounded-lg h-6 w-1/2" />
      <div className="bg-gray-200 dark:bg-gray-700 rounded-lg h-4 w-full" />
      <div className="bg-gray-200 dark:bg-gray-700 rounded-lg h-4 w-5/6" />
    </div>
  );
}

export function FormSkeleton() {
  return (
    <div className="space-y-4 animate-pulse">
      {[...new Array(4)].map((_, i) => (
        <div key={i} className="space-y-2">
          <div className="bg-gray-200 dark:bg-gray-700 rounded-lg h-4 w-1/4" />
          <div className="bg-gray-200 dark:bg-gray-700 rounded-lg h-10 w-full" />
        </div>
      ))}
      <div className="flex gap-2 pt-4">
        <div className="bg-gray-200 dark:bg-gray-700 rounded-lg h-10 w-24" />
        <div className="bg-gray-200 dark:bg-gray-700 rounded-lg h-10 w-24" />
      </div>
    </div>
  );
}
