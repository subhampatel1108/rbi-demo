
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Calendar, FileText, Hash, Tag } from 'lucide-react';
import { Report } from '@/components/ReportManagement';

interface ReportDetailsProps {
  report: Report;
  onBack: () => void;
}

const ReportDetails = ({ report, onBack }: ReportDetailsProps) => {
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
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatMetadata = (metadata: string) => {
    try {
      return JSON.stringify(JSON.parse(metadata), null, 2);
    } catch {
      return metadata;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-4">
        <Button variant="outline" size="sm" onClick={onBack}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Reports
        </Button>
      </div>

      <Card>
        <CardHeader>
          <div className="flex justify-between items-start">
            <div>
              <CardTitle className="flex items-center space-x-2">
                <FileText className="h-5 w-5" />
                <span>Report Details</span>
              </CardTitle>
              <CardDescription>Fraud ID: {report.fraudId}</CardDescription>
            </div>
            <Badge className={getStatusColor(report.status)}>
              {report.status}
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <div className="flex items-center space-x-2 text-sm font-medium text-gray-700 mb-2">
                  <Hash className="h-4 w-4" />
                  <span>Fraud ID</span>
                </div>
                <p className="text-gray-900 font-mono">{report.fraudId}</p>
              </div>

              <div>
                <div className="flex items-center space-x-2 text-sm font-medium text-gray-700 mb-2">
                  <Tag className="h-4 w-4" />
                  <span>ID Type</span>
                </div>
                <p className="text-gray-900">{report.idType}</p>
              </div>

              <div>
                <div className="flex items-center space-x-2 text-sm font-medium text-gray-700 mb-2">
                  <Calendar className="h-4 w-4" />
                  <span>Created</span>
                </div>
                <p className="text-gray-900">{formatDate(report.createdAt)}</p>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <h4 className="text-sm font-medium text-gray-700 mb-2">Description</h4>
                <p className="text-gray-900 bg-gray-50 p-3 rounded-md">{report.description}</p>
              </div>
            </div>
          </div>

          {report.metadata && (
            <div>
              <h4 className="text-sm font-medium text-gray-700 mb-2">Metadata</h4>
              <pre className="text-sm text-gray-900 bg-gray-50 p-3 rounded-md overflow-x-auto">
                {formatMetadata(report.metadata)}
              </pre>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default ReportDetails;
