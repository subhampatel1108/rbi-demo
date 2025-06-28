import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Plus, X, ChevronUp } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
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
  onSuccess?: () => void;
}

const CreateDisputeForm = ({ isOpen, onSubmit, onCancel, onSuccess }: CreateDisputeFormProps) => {
  const { email } = useAuth();
  const { toast } = useToast();
  const [identifiers, setIdentifiers] = useState<IdentifierObject[]>([
    { identifier_id: '', identity_type: '', reason: '' }
  ]);
  const [priority, setPriority] = useState<'Low' | 'Medium' | 'High'>('Medium');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const extractDomain = (email: string) => {
    if (!email || !email.includes('@')) return '';
    const fullDomain = email.split('@')[1];
    return fullDomain.split('.')[0];
  };

  // Reset form when modal opens
  useEffect(() => {
    if (isOpen) {
      setIdentifiers([{ identifier_id: '', identity_type: '', reason: '' }]);
      setPriority('Medium');
      setIsSubmitting(false);
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

  const getPriorityArrows = (priorityValue: string) => {
    let count = 1;
    let color = 'text-green-500';

    switch (priorityValue) {
      case 'Low':
        count = 1;
        color = 'text-green-500';
        break;
      case 'Medium':
        count = 2;
        color = 'text-orange-500';
        break;
      case 'High':
        count = 3;
        color = 'text-red-500';
        break;
      default:
        count = 1;
        color = 'text-green-500';
    }

    return (
      <div className="flex flex-col">
        {Array.from({ length: count }, (_, index) => (
          <ChevronUp 
            key={index} 
            className={`h-4 w-4 ${color} stroke-[2] ${index > 0 ? '-mt-3' : ''}`} 
          />
        ))}
      </div>
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const emailDomain = extractDomain(email);
    if (!emailDomain) {
      toast({
        title: "Error",
        description: "Unable to extract domain from email",
        variant: "destructive"
      });
      return;
    }

    // Validate that all identifiers are filled
    const isValid = identifiers.every(id => 
      id.identifier_id.trim() && id.identity_type.trim() && id.reason.trim()
    );
    
    if (!isValid) {
      toast({
        title: "Validation Error",
        description: "Please fill out all identifier fields",
        variant: "destructive"
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const requestBody = {
        raised_by_party_id: emailDomain,
        identifier: identifiers,
        priority: priority
      };

      const response = await fetch('http://127.0.0.1:8080/dispute', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody)
      });

      if (response.ok) {
        const result = await response.json();
        toast({
          title: "Success",
          description: "Dispute created successfully",
          variant: "info"
        });
        
        // Close modal and trigger force update
        onCancel(); // Close the modal
        if (onSuccess) {
          onSuccess(); // Trigger force update of fetchDisputes
        }
      } else {
        const errorData = await response.json().catch(() => ({ message: 'Unknown error' }));
        toast({
          title: "Error",
          description: errorData.message || "Failed to create dispute",
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error('Error creating dispute:', error);
      toast({
        title: "Error",
        description: "Network error. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onCancel}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Raise New Dispute</DialogTitle>
          <DialogDescription>Create a dispute for a fraud report</DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Priority Selection */}
          <div className="space-y-4 p-4 border border-gray-200 rounded-lg">
            <h4 className="font-medium text-gray-900">Dispute Priority</h4>
            <div className="grid grid-cols-3 gap-4">
              <div 
                className={`flex items-center p-3 rounded-lg border cursor-pointer ${priority === 'Low' ? 'border-green-500 bg-green-50' : 'border-gray-200'}`}
                onClick={() => setPriority('Low')}
              >
                <div className="mr-3">{getPriorityArrows('Low')}</div>
                <div>
                  <p className="font-medium">Low</p>
                  <p className="text-sm text-gray-500">Standard issue</p>
                </div>
              </div>
              <div 
                className={`flex items-center p-3 rounded-lg border cursor-pointer ${priority === 'Medium' ? 'border-orange-500 bg-orange-50' : 'border-gray-200'}`}
                onClick={() => setPriority('Medium')}
              >
                <div className="mr-3">{getPriorityArrows('Medium')}</div>
                <div>
                  <p className="font-medium">Medium</p>
                  <p className="text-sm text-gray-500">Important issue</p>
                </div>
              </div>
              <div 
                className={`flex items-center p-3 rounded-lg border cursor-pointer ${priority === 'High' ? 'border-red-500 bg-red-50' : 'border-gray-200'}`}
                onClick={() => setPriority('High')}
              >
                <div className="mr-3">{getPriorityArrows('High')}</div>
                <div>
                  <p className="font-medium">High</p>
                  <p className="text-sm text-gray-500">Critical issue</p>
                </div>
              </div>
            </div>
          </div>

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
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Creating...' : 'Create Dispute'}
            </Button>
            <Button type="button" variant="outline" onClick={onCancel} disabled={isSubmitting}>
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
