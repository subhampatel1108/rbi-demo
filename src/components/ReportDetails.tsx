
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { ArrowLeft, Calendar, FileText, Hash, Tag, User, Building, AlertTriangle, Clock } from 'lucide-react';
import { Report } from '@/components/ReportManagement';

interface ReportDetailsProps {
  report: Report;
  onBack: () => void;
}

const ReportDetails = ({ report, onBack }: ReportDetailsProps) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'ACTIVE': return 'bg-green-50 text-green-700 border-green-200';
      case 'BLOCKED': return 'bg-red-50 text-red-700 border-red-200';
      case 'SUSPENDED': return 'bg-yellow-50 text-yellow-700 border-yellow-200';
      case 'CLOSED': return 'bg-gray-50 text-gray-700 border-gray-200';
      default: return 'bg-gray-50 text-gray-700 border-gray-200';
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'CRITICAL': return 'bg-red-50 text-red-700 border-red-200';
      case 'HIGH': return 'bg-orange-50 text-orange-700 border-orange-200';
      case 'MEDIUM': return 'bg-yellow-50 text-yellow-700 border-yellow-200';
      case 'LOW': return 'bg-green-50 text-green-700 border-green-200';
      default: return 'bg-gray-50 text-gray-700 border-gray-200';
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
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <Button variant="outline" onClick={onBack} className="gap-2">
            <ArrowLeft className="h-4 w-4" />
            Back to Reports
          </Button>
          <div className="flex gap-2">
            <Badge className={`${getStatusColor(report.reported_identifier_status)} border`}>
              {report.reported_identifier_status}
            </Badge>
            <Badge className={`${getSeverityColor(report.reported_severity)} border`}>
              {report.reported_severity}
            </Badge>
          </div>
        </div>

        {/* Main Report Card */}
        <Card className="shadow-lg border-0">
          <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50 border-b">
            <div className="flex items-start justify-between">
              <div className="space-y-2">
                <CardTitle className="text-2xl text-gray-900 flex items-center gap-3">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <FileText className="h-6 w-6 text-blue-600" />
                  </div>
                  Fraud Report Details
                </CardTitle>
                <CardDescription className="text-lg text-gray-600">
                  Report ID: <span className="font-mono font-medium">{report.id}</span>
                </CardDescription>
              </div>
            </div>
          </CardHeader>

          <CardContent className="p-8">
            {/* Quick Info Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                <div className="flex items-center gap-3">
                  <Tag className="h-5 w-5 text-blue-600" />
                  <div>
                    <p className="text-sm font-medium text-blue-600">Fraud Type</p>
                    <p className="text-lg font-semibold text-blue-900">{report.fraud_type}</p>
                  </div>
                </div>
              </div>

              <div className="bg-purple-50 p-4 rounded-lg border border-purple-200">
                <div className="flex items-center gap-3">
                  <AlertTriangle className="h-5 w-5 text-purple-600" />
                  <div>
                    <p className="text-sm font-medium text-purple-600">Severity</p>
                    <p className="text-lg font-semibold text-purple-900">{report.reported_severity}</p>
                  </div>
                </div>
              </div>

              <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                <div className="flex items-center gap-3">
                  <Hash className="h-5 w-5 text-green-600" />
                  <div>
                    <p className="text-sm font-medium text-green-600">Status</p>
                    <p className="text-lg font-semibold text-green-900">{report.reported_identifier_status}</p>
                  </div>
                </div>
              </div>

              <div className="bg-orange-50 p-4 rounded-lg border border-orange-200">
                <div className="flex items-center gap-3">
                  <Clock className="h-5 w-5 text-orange-600" />
                  <div>
                    <p className="text-sm font-medium text-orange-600">Created</p>
                    <p className="text-sm font-semibold text-orange-900">{formatDate(report.created_at)}</p>
                  </div>
                </div>
              </div>
            </div>

            <Separator className="my-8" />

            {/* Report Details */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Left Column */}
              <div className="space-y-6">
                <Card className="border border-gray-200">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg flex items-center gap-2">
                      <FileText className="h-5 w-5 text-gray-600" />
                      Report Information
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <label className="text-sm font-medium text-gray-500">Report ID</label>
                      <p className="font-mono text-gray-900 bg-gray-50 p-2 rounded border">{report.id}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-500">Reported At</label>
                      <p className="text-gray-900">{formatDate(report.reported_at)}</p>
                    </div>
                  </CardContent>
                </Card>

                <Card className="border border-gray-200">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg flex items-center gap-2">
                      <AlertTriangle className="h-5 w-5 text-gray-600" />
                      Reason to Flag
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="bg-amber-50 border border-amber-200 p-4 rounded-lg">
                      <p className="text-gray-900 leading-relaxed">{report.reason_to_flag}</p>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Right Column */}
              <div className="space-y-6">
                {/* Suspect Identifiers */}
                {report.suspect_identifiers && report.suspect_identifiers.length > 0 && (
                  <Card className="border border-gray-200">
                    <CardHeader className="pb-3">
                      <CardTitle className="text-lg flex items-center gap-2">
                        <User className="h-5 w-5 text-gray-600" />
                        Suspect Identifiers
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        {report.suspect_identifiers.map((identifier, index) => (
                          <div key={index} className="bg-red-50 border border-red-200 p-4 rounded-lg">
                            <div className="grid grid-cols-2 gap-3 text-sm">
                              <div>
                                <span className="font-medium text-red-600">Identity:</span>
                                <p className="text-red-900">{identifier.identity}</p>
                              </div>
                              <div>
                                <span className="font-medium text-red-600">Type:</span>
                                <p className="text-red-900">{identifier.identity_type}</p>
                              </div>
                              <div>
                                <span className="font-medium text-red-600">Status:</span>
                                <p className="text-red-900">{identifier.status}</p>
                              </div>
                              <div>
                                <span className="font-medium text-red-600">Fraud Type:</span>
                                <p className="text-red-900">{identifier.fraud_type}</p>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                )}

                {/* Entities */}
                {report.entities && report.entities.length > 0 && (
                  <Card className="border border-gray-200">
                    <CardHeader className="pb-3">
                      <CardTitle className="text-lg flex items-center gap-2">
                        <Building className="h-5 w-5 text-gray-600" />
                        Entities
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        {report.entities.map((entity, index) => (
                          <div key={index} className="bg-blue-50 border border-blue-200 p-4 rounded-lg">
                            <div className="grid grid-cols-2 gap-3 text-sm">
                              <div>
                                <span className="font-medium text-blue-600">Entity ID:</span>
                                <p className="text-blue-900 font-mono">{entity.id}</p>
                              </div>
                              <div>
                                <span className="font-medium text-blue-600">Type:</span>
                                <p className="text-blue-900">{entity.entity_type}</p>
                              </div>
                              {entity.metadata.full_name && (
                                <div className="col-span-2">
                                  <span className="font-medium text-blue-600">Name:</span>
                                  <p className="text-blue-900">{entity.metadata.full_name}</p>
                                </div>
                              )}
                              {entity.metadata.business_name && (
                                <div className="col-span-2">
                                  <span className="font-medium text-blue-600">Business Name:</span>
                                  <p className="text-blue-900">{entity.metadata.business_name}</p>
                                </div>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                )}
              </div>
            </div>

            {/* Metadata Section */}
            {report.metadata && (
              <>
                <Separator className="my-8" />
                <Card className="border border-gray-200">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg flex items-center gap-2">
                      <Hash className="h-5 w-5 text-gray-600" />
                      Additional Metadata
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                      <pre className="text-sm text-gray-800 overflow-x-auto whitespace-pre-wrap">
                        {formatMetadata(report.metadata)}
                      </pre>
                    </div>
                  </CardContent>
                </Card>
              </>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ReportDetails;
