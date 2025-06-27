import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Plus, X } from 'lucide-react';
import { Dispute } from '@/components/DisputeManagement';

interface IdentifierObject {
  identifier_id: string;
  identity_type: string;
  reason: string;
}

interface CreateDisputeFormProps {
  isOpen: boolean;
  onSubmit: (dispute: Omit<Dispute, 'id' | 'createdAt'>) => void;
  onCancel: () => void;
}

const CreateDisputeForm = ({ isOpen, onSubmit, onCancel }: CreateDisputeFormProps) => {
  const [identifiers, setIdentifiers] = useState<IdentifierObject[]>([
    { identifier_id: '', identity_type: '', reason: '' }
  ]);

  // Reset form when modal opens
  useEffect(() => {
    if (isOpen) {
      setIdentifiers([{ identifier_id: '', identity_type: '', reason: '' }]);
    }
  }, [isOpen]);

  const addIdentifier = () => {
    setIdentifiers([...identifiers, { identifier_id: '', identity_type: '', reason: '' }]);
  };

  const removeIdentifier = (index: number) => {
    if (identifiers.length > 1) {
      setIdentifiers(identifiers.filter((_, i) => i !== index));
    }
  };

  const updateIdentifier = (index: number, field: keyof IdentifierObject, value: string) => {
    const updated = identifiers.map((identifier, i) => 
      i === index ? { ...identifier, [field]: value } : identifier
    );
    setIdentifiers(updated);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Generate random dispute ID and report ID
    const disputeId = `DSP-${Math.random().toString(36).substr(2, 6).toUpperCase()}`;
    const reportId = `FRD-${Math.random().toString(36).substr(2, 6).toUpperCase()}`;
    
    // Create dispute object with identifiers array
    const disputeData = {
      disputeId,
      reportId,
      status: 'Pending' as const,
      priority: 'Medium' as const,
      reason: 'Multiple Identifier Issues', // Default reason
      description: identifiers.map((id, index) => 
        `${index + 1}. ${id.identity_type}: ${id.identifier_id} - ${id.reason}`
      ).join('\n'),
      identifiers: identifiers
    };
    
    onSubmit(disputeData);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onCancel}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Raise New Dispute</DialogTitle>
          <DialogDescription>Create a dispute for a fraud report</DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          {identifiers.map((identifier, index) => (
            <div key={index} className="space-y-4 p-4 border border-gray-200 rounded-lg">
              <div className="flex justify-between items-center">
                <h4 className="font-medium text-gray-900">
                  Identifier {index + 1}
                </h4>
                {identifiers.length > 1 && (
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => removeIdentifier(index)}
                    className="px-2"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                )}
              </div>

              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>Customer Identifier</Label>
                  <div className="flex">
                    <Select 
                      value={identifier.identity_type} 
                      onValueChange={(value) => updateIdentifier(index, 'identity_type', value)}
                    >
                      <SelectTrigger className="rounded-r-none border-r-0 w-48 focus:ring-0">
                        <SelectValue placeholder="Select type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="PAN">PAN</SelectItem>
                        <SelectItem value="AADHAAR">AADHAAR</SelectItem>
                        <SelectItem value="PHONE">PHONE</SelectItem>
                        <SelectItem value="PASSPORT">PASSPORT</SelectItem>
                        <SelectItem value="VOTER ID">VOTER ID</SelectItem>
                      </SelectContent>
                    </Select>
                    <Input
                      value={identifier.identifier_id}
                      onChange={(e) => updateIdentifier(index, 'identifier_id', e.target.value)}
                      placeholder="Enter identifier value"
                      className="rounded-l-none border-r-0 bg-gray-50 flex-1"
                      noFocusBorder
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Description</Label>
                  <Textarea
                    value={identifier.reason}
                    onChange={(e) => updateIdentifier(index, 'reason', e.target.value)}
                    placeholder="Provide detailed information about this identifier..."
                    rows={3}
                    required
                  />
                </div>
              </div>
            </div>
          ))}

          <div className="flex justify-center">
            <Button
              type="button"
              variant="outline"
              onClick={addIdentifier}
              className="flex items-center space-x-2"
            >
              <Plus className="h-4 w-4" />
              <span>Add Another Identifier</span>
            </Button>
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
