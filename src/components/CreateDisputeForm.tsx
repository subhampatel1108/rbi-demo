
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft } from 'lucide-react';
import { Dispute } from '@/components/DisputeManagement';

interface CreateDisputeFormProps {
  onSubmit: (dispute: Omit<Dispute, 'id' | 'createdAt'>) => void;
  onCancel: () => void;
}

const CreateDisputeForm = ({ onSubmit, onCancel }: CreateDisputeFormProps) => {
  const [formData, setFormData] = useState({
    disputeId: '',
    reportId: '',
    reason: '',
    description: '',
    status: 'Pending' as const,
    priority: 'Medium' as const
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
          Back to Disputes
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Raise New Dispute</CardTitle>
          <CardDescription>Create a dispute for a fraud report</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="disputeId">Dispute ID</Label>
                <Input
                  id="disputeId"
                  value={formData.disputeId}
                  onChange={(e) => setFormData({ ...formData, disputeId: e.target.value })}
                  placeholder="DSP-XXX"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="reportId">Related Report ID</Label>
                <Input
                  id="reportId"
                  value={formData.reportId}
                  onChange={(e) => setFormData({ ...formData, reportId: e.target.value })}
                  placeholder="FRD-XXX"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="reason">Dispute Reason</Label>
                <Select value={formData.reason} onValueChange={(value) => setFormData({ ...formData, reason: value })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select dispute reason" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="False Positive">False Positive</SelectItem>
                    <SelectItem value="Incomplete Investigation">Incomplete Investigation</SelectItem>
                    <SelectItem value="Wrong Classification">Wrong Classification</SelectItem>
                    <SelectItem value="Missing Evidence">Missing Evidence</SelectItem>
                    <SelectItem value="Process Error">Process Error</SelectItem>
                    <SelectItem value="Other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="priority">Priority</Label>
                <Select value={formData.priority} onValueChange={(value: any) => setFormData({ ...formData, priority: value })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Low">Low</SelectItem>
                    <SelectItem value="Medium">Medium</SelectItem>
                    <SelectItem value="High">High</SelectItem>
                    <SelectItem value="Critical">Critical</SelectItem>
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
                placeholder="Provide detailed information about the dispute..."
                rows={4}
                required
              />
            </div>

            <div className="flex space-x-4 pt-4">
              <Button type="submit">Create Dispute</Button>
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

export default CreateDisputeForm;
