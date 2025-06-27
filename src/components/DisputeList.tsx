import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Eye, ChevronUp } from 'lucide-react';
import { Dispute } from '@/components/DisputeManagement';

interface DisputeListProps {
  disputes: Dispute[];
  onViewDispute: (dispute: Dispute) => void;
  newlyCreatedDisputes: Set<string>;
}

interface DisputeRowProps {
  dispute: Dispute;
  onViewDispute: (dispute: Dispute) => void;
  isNewlyCreated: boolean;
}

const getStatusColor = (status: string) => {
  switch (status) {
    case 'PENDING': return 'bg-yellow-200 text-yellow-900';
    case 'RESOLVED': return 'bg-green-100 text-green-800';
    case 'REJECTED': return 'bg-red-100 text-red-800';
    case 'INFO_REQUESTED': return 'bg-blue-100 text-blue-800';
    default: return 'bg-gray-100 text-gray-800';
  }
};

const getPriorityArrows = (priority: string) => {
  let count = 1;
  let color = 'text-green-500'; // green for low

  switch (priority) {
    case 'Low':
      count = 1;
      color = 'text-green-500';
      break;
    case 'Medium':
      count = 2;
      color = 'text-orange-500';
      break;
    case 'High':
      count = 3;
      color = 'text-red-500';
      break;
    default:
      count = 1;
      color = 'text-green-500';
  }

  // Create a container div with stacked arrows
  return (
    <div className="flex flex-col">
      {Array.from({ length: count }, (_, index) => (
        <ChevronUp 
          key={index} 
          className={`h-4 w-4 ${color} stroke-[2] ${index > 0 ? '-mt-3' : ''}`} 
        />
      ))}
    </div>
  );
};

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
};

// Custom comparison function for deep dispute comparison
const disputeEqual = (prevProps: DisputeRowProps, nextProps: DisputeRowProps) => {
  const prev = prevProps.dispute;
  const next = nextProps.dispute;
  
  // Compare all relevant fields that would affect rendering
  return (
    prev.id === next.id &&
    prev.disputeId === next.disputeId &&
    prev.reason === next.reason &&
    prev.status === next.status &&
    prev.priority === next.priority &&
    prev.createdAt === next.createdAt &&
    prevProps.onViewDispute === nextProps.onViewDispute &&
    prevProps.isNewlyCreated === nextProps.isNewlyCreated
  );
};

// Memoized row component with custom comparison
const DisputeRow = React.memo(({ dispute, onViewDispute, isNewlyCreated }: DisputeRowProps) => {
  
  return (
    <TableRow 
      className={`cursor-pointer hover:bg-gray-50 transition-colors ${
        isNewlyCreated 
          ? 'fade-from-yellow bg-yellow-200' 
          : ''
      }`}
      onClick={() => onViewDispute(dispute)}
    >
      <TableCell className="font-medium">
        <div className="flex items-center space-x-2">
          <span className="flex items-center space-x-1">
            <span>{dispute.disputeId}</span>
            {getPriorityArrows(dispute.priority)}
          </span>
        </div>
      </TableCell>
      <TableCell>{dispute.reason}</TableCell>
      <TableCell>
                  <Badge 
            className={`${getStatusColor(dispute.status)} text-xs font-bold`}
            noHover
          >
            {dispute.status}
          </Badge>
      </TableCell>
      <TableCell>{formatDate(dispute.createdAt)}</TableCell>
    </TableRow>
  );
}, disputeEqual);

DisputeRow.displayName = 'DisputeRow';

const DisputeList = ({ disputes, onViewDispute, newlyCreatedDisputes }: DisputeListProps) => {
  return (
    <Card className="rounded-lg border border-gray-200 shadow-sm overflow-hidden">
      <CardContent className="p-0">
        <style>
          {`
            @keyframes fadeFromYellow {
              0% {
                background-color: rgb(254 240 138);
              }
              100% {
                background-color: transparent;
              }
            }
            .fade-from-yellow {
              animation: fadeFromYellow 3s ease-out forwards;
            }
          `}
        </style>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Dispute ID</TableHead>
              <TableHead>Reason</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Created</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {disputes.map((dispute) => (
              <DisputeRow 
                key={dispute.id}
                dispute={dispute}
                onViewDispute={onViewDispute}
                isNewlyCreated={newlyCreatedDisputes.has(dispute.id)}
              />
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};

DisputeList.displayName = 'DisputeList';

export default DisputeList;
