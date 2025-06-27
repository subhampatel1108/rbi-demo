import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Plus, X } from 'lucide-react';
import { Dispute } from '@/components/DisputeManagement';

interface CustomerIdentifier {
  type: string;
  value: string;
}

interface CreateDisputeFormProps {
  isOpen: boolean;
  onSubmit: (dispute: Omit<Dispute, 'id' | 'createdAt'>) => void;
  onCancel: () => void;
}

const CreateDisputeForm = ({ isOpen, onSubmit, onCancel }: CreateDisputeFormProps) => {
  const [formData, setFormData] = useState({
    reason: '',
    description: '',
    status: 'Pending' as const,
    priority: 'Medium' as const
  });
  
  const [customerIdentifiers, setCustomerIdentifiers] = useState<CustomerIdentifier[]>([
    { type: '', value: '' }
  ]);

  // Reset form when modal opens
  useEffect(() => {
    if (isOpen) {
      setFormData({
        reason: '',
        description: '',
        status: 'Pending' as const,
        priority: 'Medium' as const
      });
      setCustomerIdentifiers([{ type: '', value: '' }]);
    }
  }, [isOpen]);

  const addCustomerIdentifier = () => {
    if (customerIdentifiers.length < 3) {
      setCustomerIdentifiers([...customerIdentifiers, { type: '', value: '' }]);
    }
  };

  const removeCustomerIdentifier = (index: number) => {
    if (customerIdentifiers.length > 1) {
      setCustomerIdentifiers(customerIdentifiers.filter((_, i) => i !== index));
    }
  };

  const updateCustomerIdentifier = (index: number, field: 'type' | 'value', value: string) => {
    const updated = customerIdentifiers.map((identifier, i) => 
      i === index ? { ...identifier, [field]: value } : identifier
    );
    setCustomerIdentifiers(updated);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Generate random dispute ID and report ID
    const disputeId = `DSP-${Math.random().toString(36).substr(2, 6).toUpperCase()}`;
    const reportId = `FRD-${Math.random().toString(36).substr(2, 6).toUpperCase()}`;
    onSubmit({ ...formData, disputeId, reportId });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onCancel}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Raise New Dispute</DialogTitle>
          <DialogDescription>Create a dispute for a fraud report</DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-4">
            <Label>Customer Identifier{customerIdentifiers.length > 1 ? 's' : ''}</Label>
            {customerIdentifiers.map((identifier, index) => (
              <div key={index} className="space-y-2">
                <div className="grid grid-cols-5 gap-4">
                  <div className="col-span-2">
                    <Select 
                      value={identifier.type} 
                      onValueChange={(value) => updateCustomerIdentifier(index, 'type', value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select identifier type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="PAN">PAN</SelectItem>
                        <SelectItem value="AADHAAR">AADHAAR</SelectItem>
                        <SelectItem value="PHONE">PHONE</SelectItem>
                        <SelectItem value="PASSPORT">PASSPORT</SelectItem>
                        <SelectItem value="VOTER ID">VOTER ID</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="col-span-3 flex space-x-2">
                    <Input
                      value={identifier.value}
                      onChange={(e) => updateCustomerIdentifier(index, 'value', e.target.value)}
                      placeholder="Enter identifier value"
                      disabled={!identifier.type}
                      required={!!identifier.type}
                      className="flex-1 bg-gray-50"
                    />
                    <div className="flex space-x-1">
                      {index < 2 && customerIdentifiers.length < 3 && (
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={addCustomerIdentifier}
                          className="px-2"
                        >
                          <Plus className="h-4 w-4" />
                        </Button>
                      )}
                      {customerIdentifiers.length > 1 && (
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => removeCustomerIdentifier(index)}
                          className="px-2"
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
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
          
          <p className="text-sm text-gray-500 mt-4">
            <strong>Note:</strong> Dispute ID will be auto-generated on submit
          </p>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default CreateDisputeForm;
