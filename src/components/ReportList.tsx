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
      case 'ACTIVE': return 'bg-green-100 text-green-800';
      case 'BLOCKED': return 'bg-red-100 text-red-800';
      case 'SUSPENDED': return 'bg-yellow-100 text-yellow-800';
      case 'CLOSED': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'HIGH': return 'bg-red-100 text-red-800';
      case 'MEDIUM': return 'bg-yellow-100 text-yellow-800';
      case 'LOW': return 'bg-green-100 text-green-800';
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
              <TableHead>Report Name</TableHead>
              <TableHead>Fraud Type</TableHead>
              <TableHead>Severity</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Created</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {reports.map((report) => (
              <TableRow key={report.id}>
                <TableCell>{report.report_name}</TableCell>
                <TableCell>{report.fraud_type}</TableCell>
                <TableCell>
                  <Badge className={getSeverityColor(report.reported_severity)}>
                    {report.reported_severity}
                  </Badge>
                </TableCell>
                <TableCell>
                  <Badge className={getStatusColor(report.reported_identifier_status)}>
                    {report.reported_identifier_status}
                  </Badge>
                </TableCell>
                <TableCell>{formatDate(report.created_at)}</TableCell>
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
