
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft } from 'lucide-react';
import { Report } from '@/components/ReportManagement';

interface CreateReportFormProps {
  onSubmit: (report: Omit<Report, 'id' | 'createdAt'>) => void;
  onCancel: () => void;
}

const CreateReportForm = ({ onSubmit, onCancel }: CreateReportFormProps) => {
  const [formData, setFormData] = useState({
    fraudId: '',
    idType: '',
    metadata: '',
    status: 'Open' as const,
    description: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
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
          <CardTitle>Create New Fraud Report</CardTitle>
          <CardDescription>Fill in the details to create a new fraud report</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="fraudId">Fraud ID</Label>
                <Input
                  id="fraudId"
                  value={formData.fraudId}
                  onChange={(e) => setFormData({ ...formData, fraudId: e.target.value })}
                  placeholder="FRD-XXX"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="idType">ID Type</Label>
                <Select value={formData.idType} onValueChange={(value) => setFormData({ ...formData, idType: value })}>
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

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Describe the fraud incident..."
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="metadata">Metadata (JSON)</Label>
              <Textarea
                id="metadata"
                value={formData.metadata}
                onChange={(e) => setFormData({ ...formData, metadata: e.target.value })}
                placeholder='{"ip": "192.168.1.1", "device": "mobile", "location": "NYC"}'
                rows={3}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="status">Status</Label>
              <Select value={formData.status} onValueChange={(value: any) => setFormData({ ...formData, status: value })}>
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

            <div className="flex space-x-4 pt-4">
              <Button type="submit">Create Report</Button>
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

export default CreateReportForm;
