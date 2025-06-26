
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Eye } from 'lucide-react';
import { Report } from '@/components/ReportManagement';

interface ReportListProps {
  reports: Report[];
  onViewReport: (report: Report) => void;
}

const ReportList = ({ reports, onViewReport }: ReportListProps) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Open': return 'bg-red-100 text-red-800';
      case 'Under Investigation': return 'bg-yellow-100 text-yellow-800';
      case 'Resolved': return 'bg-green-100 text-green-800';
      case 'Closed': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <Card>
      <CardContent className="p-0">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Fraud ID</TableHead>
              <TableHead>ID Type</TableHead>
              <TableHead>Description</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Created</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {reports.map((report) => (
              <TableRow key={report.id}>
                <TableCell className="font-medium">{report.fraudId}</TableCell>
                <TableCell>{report.idType}</TableCell>
                <TableCell className="max-w-xs truncate">{report.description}</TableCell>
                <TableCell>
                  <Badge className={getStatusColor(report.status)}>
                    {report.status}
                  </Badge>
                </TableCell>
                <TableCell>{formatDate(report.createdAt)}</TableCell>
                <TableCell>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onViewReport(report)}
                  >
                    <Eye className="h-4 w-4 mr-2" />
                    View
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};

export default ReportList;
