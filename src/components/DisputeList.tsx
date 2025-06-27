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
}

interface DisputeRowProps {
  dispute: Dispute;
  onViewDispute: (dispute: Dispute) => void;
}

const getStatusColor = (status: string) => {
  switch (status) {
    case 'Pending': return 'bg-yellow-100 text-yellow-800';
    case 'Under Review': return 'bg-blue-100 text-blue-800';
    case 'Approved': return 'bg-green-100 text-green-800';
    case 'Rejected': return 'bg-red-100 text-red-800';
    case 'Closed': return 'bg-gray-100 text-gray-800';
    default: return 'bg-gray-100 text-gray-800';
  }
};

const getPriorityArrows = (priority: string) => {
  let count = 1;
  let color = 'text-yellow-500'; // more vibrant yellow for low

  switch (priority) {
    case 'Low':
      count = 1;
      color = 'text-yellow-500';
      break;
    case 'Medium':
      count = 2;
      color = 'text-orange-600';
      break;
    case 'High':
      count = 3;
      color = 'text-red-600';
      break;
    case 'Critical':
      count = 3;
      color = 'text-red-700';
      break;
    default:
      count = 1;
      color = 'text-yellow-500';
  }

  return Array.from({ length: count }, (_, index) => (
    <ChevronUp key={index} className={`h-4 w-4 ${color} stroke-[3] -mb-1`} />
  ));
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
    prevProps.onViewDispute === nextProps.onViewDispute
  );
};

// Memoized row component with custom comparison
const DisputeRow = React.memo(({ dispute, onViewDispute }: DisputeRowProps) => {
  
  return (
    <TableRow 
      className="cursor-pointer hover:bg-gray-50 transition-colors"
      onClick={() => onViewDispute(dispute)}
    >
      <TableCell className="font-medium">
        <div className="flex items-center space-x-2">
          <span>{dispute.disputeId}</span>
          <div className="flex flex-col items-center">
            {getPriorityArrows(dispute.priority)}
          </div>
        </div>
      </TableCell>
      <TableCell>{dispute.reason}</TableCell>
      <TableCell>
        <Badge className={getStatusColor(dispute.status)} noHover>
          {dispute.status}
        </Badge>
      </TableCell>
      <TableCell>{formatDate(dispute.createdAt)}</TableCell>
    </TableRow>
  );
}, disputeEqual);

DisputeRow.displayName = 'DisputeRow';

const DisputeList = React.memo(({ disputes, onViewDispute }: DisputeListProps) => {
  return (
    <Card>
      <CardContent className="p-0">
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
              />
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
});

DisputeList.displayName = 'DisputeList';

export default DisputeList;
