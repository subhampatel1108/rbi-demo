import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { ArrowLeft, Calendar, FileText, Hash, Tag, User, Building, AlertTriangle, Clock, Copy, Eye, EyeOff } from 'lucide-react';
import { Report } from '@/components/ReportManagement';

interface ReportDetailsProps {
  report: Report;
  onBack: () => void;
}

const ReportDetails = ({ report, onBack }: ReportDetailsProps) => {
  const [isMetadataExpanded, setIsMetadataExpanded] = useState(false);
  const [copiedMetadata, setCopiedMetadata] = useState(false);

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

  const copyMetadataToClipboard = () => {
    const formattedMetadata = formatMetadata(report.metadata);
    navigator.clipboard.writeText(formattedMetadata);
    setCopiedMetadata(true);
    setTimeout(() => setCopiedMetadata(false), 2000);
  };

  const renderMetadataValue = (key: string, value: any, level: number = 0) => {
    const indent = level * 20;
    
    if (value === null || value === undefined) {
      return (
        <div key={key} style={{ marginLeft: indent }} className="flex items-center gap-2 py-1">
          <span className="font-medium text-gray-600">{key}:</span>
          <span className="text-gray-400 italic">null</span>
        </div>
      );
    }

    if (typeof value === 'boolean') {
      return (
        <div key={key} style={{ marginLeft: indent }} className="flex items-center gap-2 py-1">
          <span className="font-medium text-gray-600">{key}:</span>
          <Badge variant={value ? "default" : "secondary"} className="text-xs">
            {value.toString()}
          </Badge>
        </div>
      );
    }

    if (typeof value === 'string' || typeof value === 'number') {
      return (
        <div key={key} style={{ marginLeft: indent }} className="flex items-center gap-2 py-1">
          <span className="font-medium text-gray-600">{key}:</span>
          <span className="text-gray-900 bg-gray-50 px-2 py-1 rounded border text-sm">
            {value.toString()}
          </span>
        </div>
      );
    }

    if (Array.isArray(value)) {
      return (
        <div key={key} style={{ marginLeft: indent }} className="py-1">
          <span className="font-medium text-gray-600">{key}:</span>
          <div className="ml-4 mt-1 space-y-1">
            {value.map((item, index) => (
              <div key={index} className="flex items-center gap-2">
                <span className="text-xs text-gray-500">•</span>
                {typeof item === 'object' ? (
                  <div className="bg-blue-50 border border-blue-200 p-2 rounded text-sm">
                    {Object.entries(item).map(([k, v]) => 
                      renderMetadataValue(k, v, 0)
                    )}
                  </div>
                ) : (
                  <span className="text-gray-900 bg-gray-50 px-2 py-1 rounded border text-sm">
                    {item?.toString()}
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>
      );
    }

    if (typeof value === 'object') {
      return (
        <div key={key} style={{ marginLeft: indent }} className="py-1">
          <span className="font-medium text-gray-600">{key}:</span>
          <div className="ml-4 mt-1 bg-gray-50 border border-gray-200 p-3 rounded">
            {Object.entries(value).map(([k, v]) => 
              renderMetadataValue(k, v, 0)
            )}
          </div>
        </div>
      );
    }

    return (
      <div key={key} style={{ marginLeft: indent }} className="flex items-center gap-2 py-1">
        <span className="font-medium text-gray-600">{key}:</span>
        <span className="text-gray-900">{value?.toString()}</span>
      </div>
    );
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
                {/* Suspect Identifiers with Entities */}
                {report.suspect_identifiers && report.suspect_identifiers.length > 0 && (
                  <Card className="border border-gray-200">
                    <CardHeader className="pb-3">
                      <CardTitle className="text-lg flex items-center gap-2">
                        <User className="h-5 w-5 text-gray-600" />
                        Suspect Identifiers & Entities
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {report.suspect_identifiers.map((identifier, index) => (
                          <div key={index} className="bg-red-50 border border-red-200 p-4 rounded-lg">
                            <div className="mb-3">
                              <h5 className="font-medium text-red-600 mb-2">Identifier {index + 1}</h5>
                              <div className="grid grid-cols-2 gap-3 text-sm mb-3">
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
                            
                            {identifier.entities && identifier.entities.length > 0 && (
                              <div className="border-t border-red-300 pt-3">
                                <h6 className="font-medium text-red-600 text-sm mb-2 flex items-center gap-1">
                                  <Building className="h-3 w-3" />
                                  Associated Entities ({identifier.entities.length})
                                </h6>
                                <div className="space-y-2">
                                  {identifier.entities.map((entity, entityIndex) => (
                                    <div key={entityIndex} className="bg-white border border-red-200 p-3 rounded text-xs">
                                      <div className="grid grid-cols-2 gap-2">
                                        <div>
                                          <span className="font-medium text-red-600">Entity ID:</span>
                                          <p className="text-red-900 font-mono">{entity.id}</p>
                                        </div>
                                        <div>
                                          <span className="font-medium text-red-600">Type:</span>
                                          <p className="text-red-900">{entity.entity_type}</p>
                                        </div>
                                        {entity.metadata.full_name && (
                                          <div className="col-span-2">
                                            <span className="font-medium text-red-600">Name:</span>
                                            <p className="text-red-900">{entity.metadata.full_name}</p>
                                          </div>
                                        )}
                                        {entity.metadata.business_name && (
                                          <div className="col-span-2">
                                            <span className="font-medium text-red-600">Business Name:</span>
                                            <p className="text-red-900">{entity.metadata.business_name}</p>
                                          </div>
                                        )}
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            )}
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
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg flex items-center gap-2">
                        <Hash className="h-5 w-5 text-gray-600" />
                        Additional Metadata
                      </CardTitle>
                      <div className="flex items-center gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setIsMetadataExpanded(!isMetadataExpanded)}
                          className="gap-2"
                        >
                          {isMetadataExpanded ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                          {isMetadataExpanded ? 'Collapse' : 'Expand'}
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={copyMetadataToClipboard}
                          className="gap-2"
                        >
                          <Copy className="h-4 w-4" />
                          {copiedMetadata ? 'Copied!' : 'Copy JSON'}
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    {isMetadataExpanded ? (
                      <div className="space-y-3">
                        {Object.entries(report.metadata).map(([key, value]) => 
                          renderMetadataValue(key, value)
                        )}
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {/* Key-Value Summary */}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                          {Object.entries(report.metadata).slice(0, 6).map(([key, value]) => (
                            <div key={key} className="bg-blue-50 border border-blue-200 p-3 rounded-lg">
                              <div className="text-xs font-medium text-blue-600 uppercase tracking-wide mb-1">
                                {key.replace(/_/g, ' ')}
                              </div>
                              <div className="text-sm text-blue-900 font-medium">
                                {typeof value === 'object' ? 
                                  `${Array.isArray(value) ? value.length + ' items' : Object.keys(value).length + ' fields'}` : 
                                  value?.toString().slice(0, 50) + (value?.toString().length > 50 ? '...' : '')
                                }
                              </div>
                            </div>
                          ))}
                        </div>
                        
                        {Object.keys(report.metadata).length > 6 && (
                          <div className="text-center">
                            <Badge variant="secondary" className="text-xs">
                              +{Object.keys(report.metadata).length - 6} more fields
                            </Badge>
                          </div>
                        )}
                      </div>
                    )}
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
