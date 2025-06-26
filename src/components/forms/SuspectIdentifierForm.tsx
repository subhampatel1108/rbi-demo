
import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Plus, Trash2 } from 'lucide-react';
import { Report, SuspectIdentifier } from '@/components/ReportManagement';

interface SuspectIdentifierFormProps {
  formData: Omit<Report, 'created_at'>;
  setFormData: (data: Omit<Report, 'created_at'>) => void;
}

export const SuspectIdentifierForm = ({ formData, setFormData }: SuspectIdentifierFormProps) => {
  const updateSuspectIdentifier = (index: number, field: string, value: any) => {
    const newIdentifiers = [...formData.suspect_identifiers];
    if (field.includes('.')) {
      const [parent, child] = field.split('.');
      const currentIdentifier = newIdentifiers[index];
      const parentObj = currentIdentifier[parent as keyof SuspectIdentifier];
      newIdentifiers[index] = {
        ...currentIdentifier,
        [parent]: {
          ...(typeof parentObj === 'object' && parentObj !== null ? parentObj as Record<string, any> : {}),
          [child]: value
        }
      };
    } else {
      newIdentifiers[index] = { ...newIdentifiers[index], [field]: value };
    }
    setFormData({ ...formData, suspect_identifiers: newIdentifiers });
  };

  const addSuspectIdentifier = () => {
    setFormData({
      ...formData,
      suspect_identifiers: [
        ...formData.suspect_identifiers,
        {
          id: `ID${String(formData.suspect_identifiers.length + 1).padStart(3, '0')}`,
          identity: '',
          identity_type: 'PAN',
          status: 'ACTIVE',
          recommended_status: 'FRAUD',
          fraud_type: 'KYC',
          rule_id: '',
          linked_entity_id: '',
          linked_parties: [],
          metadata: {
            geo_tag: '',
            device_id: '',
            imei: '',
            ip_address: '',
            confidence_score: 0,
            date_of_sending_report: ''
          }
        }
      ]
    });
  };

  const removeSuspectIdentifier = (index: number) => {
    if (formData.suspect_identifiers.length > 1) {
      const newIdentifiers = formData.suspect_identifiers.filter((_, i) => i !== index);
      setFormData({ ...formData, suspect_identifiers: newIdentifiers });
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">Suspect Identifiers</h3>
        <Button type="button" onClick={addSuspectIdentifier} size="sm">
          <Plus className="h-4 w-4 mr-2" />
          Add Identifier
        </Button>
      </div>

      {formData.suspect_identifiers.map((identifier, index) => (
        <Card key={index}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm">Identifier {index + 1}</CardTitle>
            {formData.suspect_identifiers.length > 1 && (
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => removeSuspectIdentifier(index)}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            )}
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label>Identity</Label>
                <Input
                  value={identifier.identity}
                  onChange={(e) => updateSuspectIdentifier(index, 'identity', e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label>Identity Type</Label>
                <Select value={identifier.identity_type} onValueChange={(value) => updateSuspectIdentifier(index, 'identity_type', value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="PAN">PAN</SelectItem>
                    <SelectItem value="MOBILE">Mobile</SelectItem>
                    <SelectItem value="EMAIL">Email</SelectItem>
                    <SelectItem value="ACCOUNT">Account</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Status</Label>
                <Select value={identifier.status} onValueChange={(value) => updateSuspectIdentifier(index, 'status', value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ACTIVE">Active</SelectItem>
                    <SelectItem value="BLOCKED">Blocked</SelectItem>
                    <SelectItem value="SUSPENDED">Suspended</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Recommended Status</Label>
                <Select value={identifier.recommended_status} onValueChange={(value) => updateSuspectIdentifier(index, 'recommended_status', value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="FRAUD">Fraud</SelectItem>
                    <SelectItem value="SUSPICIOUS">Suspicious</SelectItem>
                    <SelectItem value="CLEAR">Clear</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Fraud Type</Label>
                <Select value={identifier.fraud_type} onValueChange={(value) => updateSuspectIdentifier(index, 'fraud_type', value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="KYC">KYC</SelectItem>
                    <SelectItem value="UPI">UPI</SelectItem>
                    <SelectItem value="ACH">ACH</SelectItem>
                    <SelectItem value="Credit Card">Credit Card</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <h4 className="text-md font-semibold mt-4">Metadata</h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label>Geo Tag</Label>
                <Input
                  value={identifier.metadata.geo_tag || ''}
                  onChange={(e) => updateSuspectIdentifier(index, 'metadata.geo_tag', e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label>Device ID</Label>
                <Input
                  value={identifier.metadata.device_id || ''}
                  onChange={(e) => updateSuspectIdentifier(index, 'metadata.device_id', e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label>IMEI</Label>
                <Input
                  value={identifier.metadata.imei || ''}
                  onChange={(e) => updateSuspectIdentifier(index, 'metadata.imei', e.target.value)}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>IP Address</Label>
                <Input
                  value={identifier.metadata.ip_address || ''}
                  onChange={(e) => updateSuspectIdentifier(index, 'metadata.ip_address', e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label>Date of Sending Report</Label>
                <Input
                  type="date"
                  value={identifier.metadata.date_of_sending_report || ''}
                  onChange={(e) => updateSuspectIdentifier(index, 'metadata.date_of_sending_report', e.target.value)}
                />
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};
