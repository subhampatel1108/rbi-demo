
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
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatMetadata = (metadata: any) => {
    try {
      return JSON.stringify(metadata, null, 2);
    } catch {
      return 'Unable to display metadata';
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
              <CardDescription>Report ID: {report.id}</CardDescription>
            </div>
            <div className="flex space-x-2">
              <Badge className={getStatusColor(report.reported_identifier_status)}>
                {report.reported_identifier_status}
              </Badge>
              <Badge className={getSeverityColor(report.reported_severity)}>
                {report.reported_severity}
              </Badge>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <div className="flex items-center space-x-2 text-sm font-medium text-gray-700 mb-2">
                  <Hash className="h-4 w-4" />
                  <span>Report ID</span>
                </div>
                <p className="text-gray-900 font-mono">{report.id}</p>
              </div>

              <div>
                <div className="flex items-center space-x-2 text-sm font-medium text-gray-700 mb-2">
                  <FileText className="h-4 w-4" />
                  <span>Report Name</span>
                </div>
                <p className="text-gray-900">{report.report_name}</p>
              </div>

              <div>
                <div className="flex items-center space-x-2 text-sm font-medium text-gray-700 mb-2">
                  <Tag className="h-4 w-4" />
                  <span>Fraud Type</span>
                </div>
                <p className="text-gray-900">{report.fraud_type}</p>
              </div>

              <div>
                <div className="flex items-center space-x-2 text-sm font-medium text-gray-700 mb-2">
                  <Calendar className="h-4 w-4" />
                  <span>Created</span>
                </div>
                <p className="text-gray-900">{formatDate(report.created_at)}</p>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <h4 className="text-sm font-medium text-gray-700 mb-2">Reason to Flag</h4>
                <p className="text-gray-900 bg-gray-50 p-3 rounded-md">{report.reason_to_flag}</p>
              </div>

              <div>
                <h4 className="text-sm font-medium text-gray-700 mb-2">Action Taken</h4>
                <p className="text-gray-900 bg-gray-50 p-3 rounded-md">{report.action_taken || 'No action taken yet'}</p>
              </div>
            </div>
          </div>

          {/* Suspect Identifiers */}
          {report.suspect_identifiers && report.suspect_identifiers.length > 0 && (
            <div>
              <h4 className="text-sm font-medium text-gray-700 mb-3">Suspect Identifiers</h4>
              <div className="space-y-3">
                {report.suspect_identifiers.map((identifier, index) => (
                  <div key={index} className="border rounded-md p-3 bg-gray-50">
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div><strong>Identity:</strong> {identifier.identity}</div>
                      <div><strong>Type:</strong> {identifier.identity_type}</div>
                      <div><strong>Status:</strong> {identifier.status}</div>
                      <div><strong>Fraud Type:</strong> {identifier.fraud_type}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Metadata */}
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
