
import React, { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, Upload, Download, FileText, AlertCircle } from 'lucide-react';
import { Report } from '@/components/ReportManagement';
import { useToast } from '@/components/ui/use-toast';

interface BulkReportFormProps {
  onSubmit: (reports: Omit<Report, 'id' | 'createdAt'>[]) => void;
  onCancel: () => void;
}

const BulkReportForm = ({ onSubmit, onCancel }: BulkReportFormProps) => {
  const [csvFile, setCsvFile] = useState<File | null>(null);
  const [parsedReports, setParsedReports] = useState<Omit<Report, 'id' | 'createdAt'>[]>([]);
  const [errors, setErrors] = useState<string[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const downloadTemplate = () => {
    const csvContent = 'fraudId,idType,metadata,status,description\nFRD-001,SSN,"{""ip"": ""192.168.1.1"", ""device"": ""mobile""}",Open,Suspicious transaction detected\nFRD-002,Email,"{""location"": ""NYC"", ""amount"": ""$500""}",Under Investigation,Multiple failed login attempts';
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'bulk_reports_template.csv';
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (file.type !== 'text/csv' && !file.name.endsWith('.csv')) {
      toast({
        title: "Invalid file type",
        description: "Please upload a CSV file",
        variant: "destructive"
      });
      return;
    }

    setCsvFile(file);
    parseCSV(file);
  };

  const parseCSV = (file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const csv = e.target?.result as string;
      const lines = csv.split('\n').filter(line => line.trim());
      
      if (lines.length < 2) {
        setErrors(['CSV file must contain at least a header row and one data row']);
        return;
      }

      const headers = lines[0].split(',').map(h => h.trim());
      const expectedHeaders = ['fraudId', 'idType', 'metadata', 'status', 'description'];
      
      const missingHeaders = expectedHeaders.filter(h => !headers.includes(h));
      if (missingHeaders.length > 0) {
        setErrors([`Missing required headers: ${missingHeaders.join(', ')}`]);
        return;
      }

      const reports: Omit<Report, 'id' | 'createdAt'>[] = [];
      const parseErrors: string[] = [];

      for (let i = 1; i < lines.length; i++) {
        const values = lines[i].split(',').map(v => v.trim().replace(/^"(.*)"$/, '$1'));
        
        if (values.length !== headers.length) {
          parseErrors.push(`Row ${i + 1}: Incorrect number of columns`);
          continue;
        }

        const report: any = {};
        headers.forEach((header, index) => {
          report[header] = values[index];
        });

        // Validate required fields
        if (!report.fraudId) {
          parseErrors.push(`Row ${i + 1}: fraudId is required`);
          continue;
        }

        // Validate status
        const validStatuses = ['Open', 'Under Investigation', 'Resolved', 'Closed'];
        if (!validStatuses.includes(report.status)) {
          parseErrors.push(`Row ${i + 1}: Invalid status. Must be one of: ${validStatuses.join(', ')}`);
          continue;
        }

        // Validate idType
        const validIdTypes = ['SSN', 'Email', 'Phone', 'Credit Card', 'Bank Account'];
        if (!validIdTypes.includes(report.idType)) {
          parseErrors.push(`Row ${i + 1}: Invalid idType. Must be one of: ${validIdTypes.join(', ')}`);
          continue;
        }

        reports.push(report as Omit<Report, 'id' | 'createdAt'>);
      }

      setErrors(parseErrors);
      setParsedReports(reports);

      if (parseErrors.length === 0) {
        toast({
          title: "CSV parsed successfully",
          description: `${reports.length} reports ready to create`
        });
      }
    };

    reader.readAsText(file);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (parsedReports.length === 0) {
      toast({
        title: "No reports to create",
        description: "Please upload a valid CSV file first",
        variant: "destructive"
      });
      return;
    }

    if (errors.length > 0) {
      toast({
        title: "Please fix errors first",
        description: `${errors.length} validation errors found`,
        variant: "destructive"
      });
      return;
    }

    onSubmit(parsedReports);
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
          <CardTitle>Bulk Report Generation - CSV Upload</CardTitle>
          <CardDescription>Upload a CSV file to create multiple fraud reports at once</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Template Download Section */}
          <div className="border rounded-lg p-4 bg-blue-50">
            <div className="flex items-start space-x-3">
              <FileText className="h-5 w-5 text-blue-600 mt-0.5" />
              <div className="flex-1">
                <h4 className="font-medium text-blue-900">CSV Template</h4>
                <p className="text-sm text-blue-700 mb-3">
                  Download the template to see the required format and column headers
                </p>
                <Button onClick={downloadTemplate} variant="outline" size="sm">
                  <Download className="h-4 w-4 mr-2" />
                  Download Template
                </Button>
              </div>
            </div>
          </div>

          {/* File Upload Section */}
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="csvFile">Upload CSV File</Label>
              <div className="flex items-center space-x-4">
                <Input
                  id="csvFile"
                  type="file"
                  accept=".csv"
                  onChange={handleFileUpload}
                  ref={fileInputRef}
                  className="flex-1"
                />
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => fileInputRef.current?.click()}
                >
                  <Upload className="h-4 w-4 mr-2" />
                  Browse
                </Button>
              </div>
            </div>

            {csvFile && (
              <div className="text-sm text-gray-600">
                Selected file: {csvFile.name} ({(csvFile.size / 1024).toFixed(1)} KB)
              </div>
            )}
          </div>

          {/* Errors Section */}
          {errors.length > 0 && (
            <div className="border border-red-200 rounded-lg p-4 bg-red-50">
              <div className="flex items-start space-x-3">
                <AlertCircle className="h-5 w-5 text-red-600 mt-0.5" />
                <div className="flex-1">
                  <h4 className="font-medium text-red-900">Validation Errors</h4>
                  <ul className="mt-2 text-sm text-red-700 space-y-1">
                    {errors.map((error, index) => (
                      <li key={index}>• {error}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          )}

          {/* Preview Section */}
          {parsedReports.length > 0 && (
            <div className="border rounded-lg p-4 bg-green-50">
              <h4 className="font-medium text-green-900 mb-3">
                Preview ({parsedReports.length} reports ready)
              </h4>
              <div className="max-h-40 overflow-y-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-green-200">
                      <th className="text-left p-2">Fraud ID</th>
                      <th className="text-left p-2">ID Type</th>
                      <th className="text-left p-2">Status</th>
                      <th className="text-left p-2">Description</th>
                    </tr>
                  </thead>
                  <tbody>
                    {parsedReports.slice(0, 5).map((report, index) => (
                      <tr key={index} className="border-b border-green-100">
                        <td className="p-2">{report.fraudId}</td>
                        <td className="p-2">{report.idType}</td>
                        <td className="p-2">{report.status}</td>
                        <td className="p-2 truncate max-w-32">{report.description}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {parsedReports.length > 5 && (
                  <p className="text-xs text-green-600 mt-2">
                    ... and {parsedReports.length - 5} more reports
                  </p>
                )}
              </div>
            </div>
          )}

          {/* Submit Section */}
          <form onSubmit={handleSubmit} className="flex space-x-4 pt-4">
            <Button 
              type="submit" 
              disabled={parsedReports.length === 0 || errors.length > 0}
            >
              Create {parsedReports.length} Reports
            </Button>
            <Button type="button" variant="outline" onClick={onCancel}>
              Cancel
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default BulkReportForm;
