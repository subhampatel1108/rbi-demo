
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Calendar, FileText, Hash, AlertTriangle, Flag } from 'lucide-react';
import { Dispute } from '@/components/DisputeManagement';

interface DisputeDetailsProps {
  dispute: Dispute;
  onBack: () => void;
}

const DisputeDetails = ({ dispute, onBack }: DisputeDetailsProps) => {
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

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'Critical': return 'bg-red-100 text-red-800';
      case 'High': return 'bg-orange-100 text-orange-800';
      case 'Medium': return 'bg-yellow-100 text-yellow-800';
      case 'Low': return 'bg-green-100 text-green-800';
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

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-4">
        <Button variant="outline" size="sm" onClick={onBack}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Disputes
        </Button>
      </div>

      <Card>
        <CardHeader>
          <div className="flex justify-between items-start">
            <div>
              <CardTitle className="flex items-center space-x-2">
                <AlertTriangle className="h-5 w-5" />
                <span>Dispute Details</span>
              </CardTitle>
              <CardDescription>Dispute ID: {dispute.disputeId}</CardDescription>
            </div>
            <div className="flex space-x-2">
              <Badge className={getPriorityColor(dispute.priority)}>
                {dispute.priority}
              </Badge>
              <Badge className={getStatusColor(dispute.status)}>
                {dispute.status}
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
                  <span>Dispute ID</span>
                </div>
                <p className="text-gray-900 font-mono">{dispute.disputeId}</p>
              </div>

              <div>
                <div className="flex items-center space-x-2 text-sm font-medium text-gray-700 mb-2">
                  <FileText className="h-4 w-4" />
                  <span>Related Report ID</span>
                </div>
                <p className="text-gray-900 font-mono">{dispute.reportId}</p>
              </div>

              <div>
                <div className="flex items-center space-x-2 text-sm font-medium text-gray-700 mb-2">
                  <Flag className="h-4 w-4" />
                  <span>Reason</span>
                </div>
                <p className="text-gray-900">{dispute.reason}</p>
              </div>

              <div>
                <div className="flex items-center space-x-2 text-sm font-medium text-gray-700 mb-2">
                  <Calendar className="h-4 w-4" />
                  <span>Created</span>
                </div>
                <p className="text-gray-900">{formatDate(dispute.createdAt)}</p>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <h4 className="text-sm font-medium text-gray-700 mb-2">Description</h4>
                <p className="text-gray-900 bg-gray-50 p-3 rounded-md">{dispute.description}</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default DisputeDetails;
