import React from 'react';

interface TableSkeletonProps {
  rows?: number;
  columns?: number;
}

const TableSkeleton = ({ rows = 5, columns = 3 }: TableSkeletonProps) => {
  return (
    <div className="w-full">
      {/* Table Header Skeleton */}
      <div className="grid grid-cols-3 gap-4 p-4 border-b border-gray-200 bg-gray-50">
        {Array.from({ length: columns }, (_, index) => (
          <div key={`header-${index}`} className="h-4 bg-gray-200 rounded animate-pulse"></div>
        ))}
      </div>
      
      {/* Table Rows Skeleton */}
      <div className="space-y-0">
        {Array.from({ length: rows }, (_, rowIndex) => (
          <div key={`row-${rowIndex}`} className="grid grid-cols-3 gap-4 p-4 border-b border-gray-100 hover:bg-gray-50">
            {Array.from({ length: columns }, (_, colIndex) => (
              <div key={`cell-${rowIndex}-${colIndex}`} className="space-y-2">
                <div className="h-4 bg-gray-100 rounded animate-pulse"></div>
                {colIndex === 0 && (
                  <div className="h-3 bg-gray-50 rounded animate-pulse w-3/4"></div>
                )}
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};

export default TableSkeleton; 