
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, Plus, Trash2 } from 'lucide-react';
import { Report } from '@/components/ReportManagement';

interface BulkReportFormProps {
  onSubmit: (reports: Omit<Report, 'id' | 'createdAt'>[]) => void;
  onCancel: () => void;
}

interface BulkReportEntry {
  fraudId: string;
  idType: string;
  metadata: string;
  status: 'Open' | 'Under Investigation' | 'Resolved' | 'Closed';
  description: string;
}

const BulkReportForm = ({ onSubmit, onCancel }: BulkReportFormProps) => {
  const [commonFields, setCommonFields] = useState({
    idType: '',
    status: 'Open' as const,
    description: ''
  });

  const [reports, setReports] = useState<BulkReportEntry[]>([
    { fraudId: '', idType: '', metadata: '', status: 'Open', description: '' }
  ]);

  const addReport = () => {
    setReports([...reports, { 
      fraudId: '', 
      idType: commonFields.idType, 
      metadata: '', 
      status: commonFields.status, 
      description: commonFields.description 
    }]);
  };

  const removeReport = (index: number) => {
    if (reports.length > 1) {
      setReports(reports.filter((_, i) => i !== index));
    }
  };

  const updateReport = (index: number, field: keyof BulkReportEntry, value: string) => {
    const updatedReports = [...reports];
    updatedReports[index] = { ...updatedReports[index], [field]: value };
    setReports(updatedReports);
  };

  const applyCommonFields = () => {
    const updatedReports = reports.map(report => ({
      ...report,
      idType: commonFields.idType || report.idType,
      status: commonFields.status,
      description: commonFields.description || report.description
    }));
    setReports(updatedReports);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const validReports = reports.filter(report => report.fraudId.trim() !== '');
    if (validReports.length > 0) {
      onSubmit(validReports);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-4">
        <Button variant="outline" size="sm" onClick={onCancel}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Reports
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Bulk Report Generation</CardTitle>
          <CardDescription>Create multiple fraud reports with common fields</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Common Fields Section */}
          <div className="border rounded-lg p-4 bg-gray-50">
            <h4 className="font-medium mb-4">Common Fields (Apply to All Reports)</h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="commonIdType">ID Type</Label>
                <Select value={commonFields.idType} onValueChange={(value) => setCommonFields({ ...commonFields, idType: value })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select ID type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="SSN">SSN</SelectItem>
                    <SelectItem value="Email">Email</SelectItem>
                    <SelectItem value="Phone">Phone</SelectItem>
                    <SelectItem value="Credit Card">Credit Card</SelectItem>
                    <SelectItem value="Bank Account">Bank Account</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="commonStatus">Status</Label>
                <Select value={commonFields.status} onValueChange={(value: any) => setCommonFields({ ...commonFields, status: value })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Open">Open</SelectItem>
                    <SelectItem value="Under Investigation">Under Investigation</SelectItem>
                    <SelectItem value="Resolved">Resolved</SelectItem>
                    <SelectItem value="Closed">Closed</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="commonDescription">Description</Label>
                <Input
                  id="commonDescription"
                  value={commonFields.description}
                  onChange={(e) => setCommonFields({ ...commonFields, description: e.target.value })}
                  placeholder="Common description..."
                />
              </div>
            </div>
            <Button type="button" onClick={applyCommonFields} className="mt-4" variant="outline">
              Apply Common Fields to All Reports
            </Button>
          </div>

          {/* Individual Reports Section */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="flex justify-between items-center">
              <h4 className="font-medium">Individual Reports</h4>
              <Button type="button" onClick={addReport} variant="outline" size="sm">
                <Plus className="h-4 w-4 mr-2" />
                Add Report
              </Button>
            </div>

            {reports.map((report, index) => (
              <Card key={index} className="border-l-4 border-l-blue-500">
                <CardContent className="p-4">
                  <div className="flex justify-between items-start mb-4">
                    <h5 className="font-medium">Report #{index + 1}</h5>
                    {reports.length > 1 && (
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => removeReport(index)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor={`fraudId-${index}`}>Fraud ID *</Label>
                      <Input
                        id={`fraudId-${index}`}
                        value={report.fraudId}
                        onChange={(e) => updateReport(index, 'fraudId', e.target.value)}
                        placeholder="FRD-XXX"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor={`idType-${index}`}>ID Type</Label>
                      <Select 
                        value={report.idType} 
                        onValueChange={(value) => updateReport(index, 'idType', value)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select ID type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="SSN">SSN</SelectItem>
                          <SelectItem value="Email">Email</SelectItem>
                          <SelectItem value="Phone">Phone</SelectItem>
                          <SelectItem value="Credit Card">Credit Card</SelectItem>
                          <SelectItem value="Bank Account">Bank Account</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="space-y-2 mt-4">
                    <Label htmlFor={`description-${index}`}>Description</Label>
                    <Textarea
                      id={`description-${index}`}
                      value={report.description}
                      onChange={(e) => updateReport(index, 'description', e.target.value)}
                      placeholder="Describe the fraud incident..."
                      rows={2}
                    />
                  </div>

                  <div className="space-y-2 mt-4">
                    <Label htmlFor={`metadata-${index}`}>Metadata (JSON)</Label>
                    <Textarea
                      id={`metadata-${index}`}
                      value={report.metadata}
                      onChange={(e) => updateReport(index, 'metadata', e.target.value)}
                      placeholder='{"ip": "192.168.1.1", "device": "mobile"}'
                      rows={2}
                    />
                  </div>
                </CardContent>
              </Card>
            ))}

            <div className="flex space-x-4 pt-4">
              <Button type="submit">Create {reports.filter(r => r.fraudId.trim()).length} Reports</Button>
              <Button type="button" variant="outline" onClick={onCancel}>
                Cancel
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default BulkReportForm;
