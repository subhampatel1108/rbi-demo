import React, { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Plus, X, ChevronUp, Paperclip } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { Dispute } from '@/components/DisputeManagement';
import { API_CONFIG, API_ENDPOINTS } from '@/constants';

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
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [attachedFiles, setAttachedFiles] = useState<File[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const extractDomain = (email: string) => {
    if (!email || !email.includes('@')) return '';
    const fullDomain = email.split('@')[1];
    return fullDomain.split('.')[0];
  };

  // Reset form when modal opens
  useEffect(() => {
    if (isOpen) {
      setIdentifiers([{ identifier_id: '', identity_type: '', reason: '' }]);
      setIsSubmitting(false);
      setAttachedFiles([]);
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

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files) {
      const pdfFiles = Array.from(files).filter(file => file.type === 'application/pdf');
      if (pdfFiles.length !== files.length) {
        toast({
          title: "Invalid File Type",
          description: "Only PDF files are allowed",
          variant: "destructive"
        });
      }
      setAttachedFiles(prev => [...prev, ...pdfFiles]);
    }
  };

  const removeFile = (index: number) => {
    setAttachedFiles(prev => prev.filter((_, i) => i !== index));
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
      };

      const response = await fetch(`${API_CONFIG.HOSTNAME}${API_ENDPOINTS.CREATE_DISPUTE}`, {
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
          <p className="text-sm text-gray-500 mt-2">
            <strong>Note:</strong> Dispute ID will be auto-generated on submit
          </p>
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
                        <SelectItem value="UPI_ID">UPI ID</SelectItem>
                        <SelectItem value="MOBILE">MOBILE</SelectItem>
                        <SelectItem value="ACCOUNT_NUMBER">ACCOUNT NUMBER</SelectItem>
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
              onClick={addIdentifier}
              variant="outline"
              className="font-medium border border-gray-200 rounded-md"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Identifier
            </Button>
          </div>

          <div className="space-y-4">
            <h4 className="font-medium text-gray-900">Add attachments</h4>
            
            <div 
              onClick={() => fileInputRef.current?.click()}
              className="border-2 border-dashed border-gray-300 rounded-lg h-14 text-center cursor-pointer hover:border-gray-400 hover:bg-gray-50 transition-colors flex items-center justify-center"
            >
              <div className="flex items-center space-x-2">
                <Paperclip className="h-4 w-4 text-gray-400" />
                <span className="text-gray-500 font-medium">Upload Document</span>
              </div>
            </div>
            
            <input
              ref={fileInputRef}
              type="file"
              accept=".pdf"
              multiple
              onChange={handleFileUpload}
              className="hidden"
            />
          </div>

          {/* Display attached files */}
          {attachedFiles.length > 0 && (
            <div className="space-y-2">
              <Label>Attached Files</Label>
              <div className="space-y-2">
                {attachedFiles.map((file, index) => (
                  <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded border">
                    <span className="text-sm text-gray-700">{file.name}</span>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => removeFile(index)}
                      className="p-1 h-6 w-6"
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="flex space-x-4 pt-4">
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Creating...' : 'Create Dispute'}
            </Button>
            <Button type="button" variant="outline" onClick={onCancel} disabled={isSubmitting}>
              Cancel
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default CreateDisputeForm;
