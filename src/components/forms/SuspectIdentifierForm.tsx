
import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Plus, Trash2, Building, User } from 'lucide-react';
import { Report, SuspectIdentifier, Entity } from '@/components/ReportManagement';

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
          entities: [{
            id: `ENTITY${Date.now()}`,
            entity_type: 'INDIVIDUAL',
            linked_identifiers: [],
            parent_entity: '',
            metadata: {
              business_name: '',
              registration_number: '',
              jurisdiction: '',
              risk_score: 0,
              full_name: '',
              dob: '',
              nationality: ''
            },
            created_at: new Date().toISOString()
          }],
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

  const addEntityToIdentifier = (identifierIndex: number) => {
    const newIdentifiers = [...formData.suspect_identifiers];
    const newEntity: Entity = {
      id: `ENTITY${Date.now()}`,
      entity_type: 'INDIVIDUAL',
      linked_identifiers: [],
      parent_entity: '',
      metadata: {
        business_name: '',
        registration_number: '',
        jurisdiction: '',
        risk_score: 0,
        full_name: '',
        dob: '',
        nationality: ''
      },
      created_at: new Date().toISOString()
    };
    newIdentifiers[identifierIndex].entities.push(newEntity);
    setFormData({ ...formData, suspect_identifiers: newIdentifiers });
  };

  const removeEntityFromIdentifier = (identifierIndex: number, entityIndex: number) => {
    const newIdentifiers = [...formData.suspect_identifiers];
    if (newIdentifiers[identifierIndex].entities.length > 1) {
      newIdentifiers[identifierIndex].entities = newIdentifiers[identifierIndex].entities.filter((_, i) => i !== entityIndex);
      setFormData({ ...formData, suspect_identifiers: newIdentifiers });
    }
  };

  const updateEntity = (identifierIndex: number, entityIndex: number, field: string, value: any) => {
    const newIdentifiers = [...formData.suspect_identifiers];
    const entity = newIdentifiers[identifierIndex].entities[entityIndex];
    
    if (field.includes('metadata.')) {
      const metadataField = field.replace('metadata.', '');
      // Handle number conversion for risk_score
      if (metadataField === 'risk_score') {
        entity.metadata = {
          ...entity.metadata,
          [metadataField]: Number(value)
        };
      } else {
        entity.metadata = {
          ...entity.metadata,
          [metadataField]: value
        };
      }
    } else {
      entity[field as keyof Entity] = value;
    }
    
    setFormData({ ...formData, suspect_identifiers: newIdentifiers });
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">Suspect Identifiers & Associated Entities</h3>
        <Button type="button" onClick={addSuspectIdentifier} size="sm">
          <Plus className="h-4 w-4 mr-2" />
          Add Identifier
        </Button>
      </div>

      {formData.suspect_identifiers.map((identifier, identifierIndex) => (
        <Card key={identifierIndex} className="border-2">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
            <CardTitle className="text-lg flex items-center gap-2">
              <User className="h-5 w-5" />
              Identifier {identifierIndex + 1}
            </CardTitle>
            {formData.suspect_identifiers.length > 1 && (
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => removeSuspectIdentifier(identifierIndex)}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            )}
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Basic Identifier Information */}
            <div className="space-y-4">
              <h4 className="text-md font-semibold text-gray-700 border-b pb-2">Basic Information</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label className="text-sm font-medium">Identity *</Label>
                  <Input
                    value={identifier.identity}
                    onChange={(e) => updateSuspectIdentifier(identifierIndex, 'identity', e.target.value)}
                    placeholder="Enter identity value"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-sm font-medium">Identity Type</Label>
                  <Select value={identifier.identity_type} onValueChange={(value) => updateSuspectIdentifier(identifierIndex, 'identity_type', value)}>
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
                  <Label className="text-sm font-medium">Current Status</Label>
                  <Select value={identifier.status} onValueChange={(value) => updateSuspectIdentifier(identifierIndex, 'status', value)}>
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
            </div>

            {/* Risk Assessment */}
            <div className="space-y-4">
              <h4 className="text-md font-semibold text-gray-700 border-b pb-2">Risk Assessment</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label className="text-sm font-medium">Recommended Status</Label>
                  <Select value={identifier.recommended_status} onValueChange={(value) => updateSuspectIdentifier(identifierIndex, 'recommended_status', value)}>
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
                  <Label className="text-sm font-medium">Fraud Type</Label>
                  <Select value={identifier.fraud_type} onValueChange={(value) => updateSuspectIdentifier(identifierIndex, 'fraud_type', value)}>
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
                <div className="space-y-2">
                  <Label className="text-sm font-medium">Confidence Score</Label>
                  <Input
                    type="number"
                    min="0"
                    max="100"
                    value={identifier.metadata.confidence_score || 0}
                    onChange={(e) => updateSuspectIdentifier(identifierIndex, 'metadata.confidence_score', Number(e.target.value))}
                    placeholder="0-100"
                  />
                </div>
              </div>
            </div>

            {/* Technical Metadata */}
            <div className="space-y-4">
              <h4 className="text-md font-semibold text-gray-700 border-b pb-2">Technical Information</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label className="text-sm font-medium">Geo Tag</Label>
                  <Input
                    value={identifier.metadata.geo_tag || ''}
                    onChange={(e) => updateSuspectIdentifier(identifierIndex, 'metadata.geo_tag', e.target.value)}
                    placeholder="Location information"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-sm font-medium">Device ID</Label>
                  <Input
                    value={identifier.metadata.device_id || ''}
                    onChange={(e) => updateSuspectIdentifier(identifierIndex, 'metadata.device_id', e.target.value)}
                    placeholder="Device identifier"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-sm font-medium">IP Address</Label>
                  <Input
                    value={identifier.metadata.ip_address || ''}
                    onChange={(e) => updateSuspectIdentifier(identifierIndex, 'metadata.ip_address', e.target.value)}
                    placeholder="IP address"
                  />
                </div>
              </div>
            </div>

            {/* Associated Entities */}
            <div className="border-t pt-6">
              <div className="flex justify-between items-center mb-4">
                <h4 className="text-md font-semibold flex items-center gap-2">
                  <Building className="h-4 w-4" />
                  Associated Entities
                </h4>
                <Button type="button" onClick={() => addEntityToIdentifier(identifierIndex)} size="sm" variant="outline">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Entity
                </Button>
              </div>

              {identifier.entities.map((entity, entityIndex) => (
                <Card key={entityIndex} className="mb-4 bg-gray-50 border-gray-200">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-xs">Entity {entityIndex + 1}</CardTitle>
                    {identifier.entities.length > 1 && (
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => removeEntityFromIdentifier(identifierIndex, entityIndex)}
                      >
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    )}
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      <div className="space-y-2">
                        <Label className="text-xs">Entity ID</Label>
                        <Input
                          size="sm"
                          value={entity.id}
                          onChange={(e) => updateEntity(identifierIndex, entityIndex, 'id', e.target.value)}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label className="text-xs">Entity Type</Label>
                        <Select 
                          value={entity.entity_type} 
                          onValueChange={(value) => updateEntity(identifierIndex, entityIndex, 'entity_type', value)}
                        >
                          <SelectTrigger className="h-8">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="INDIVIDUAL">Individual</SelectItem>
                            <SelectItem value="BUSINESS">Business</SelectItem>
                            <SelectItem value="MERCHANT">Merchant</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    {entity.entity_type === 'BUSINESS' || entity.entity_type === 'MERCHANT' ? (
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                        <div className="space-y-2">
                          <Label className="text-xs">Business Name</Label>
                          <Input
                            size="sm"
                            value={entity.metadata.business_name || ''}
                            onChange={(e) => updateEntity(identifierIndex, entityIndex, 'metadata.business_name', e.target.value)}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label className="text-xs">Registration Number</Label>
                          <Input
                            size="sm"
                            value={entity.metadata.registration_number || ''}
                            onChange={(e) => updateEntity(identifierIndex, entityIndex, 'metadata.registration_number', e.target.value)}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label className="text-xs">Risk Score</Label>
                          <Input
                            type="number"
                            size="sm"
                            min="0"
                            max="100"
                            value={entity.metadata.risk_score || 0}
                            onChange={(e) => updateEntity(identifierIndex, entityIndex, 'metadata.risk_score', Number(e.target.value))}
                          />
                        </div>
                      </div>
                    ) : (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        <div className="space-y-2">
                          <Label className="text-xs">Full Name</Label>
                          <Input
                            size="sm"
                            value={entity.metadata.full_name || ''}
                            onChange={(e) => updateEntity(identifierIndex, entityIndex, 'metadata.full_name', e.target.value)}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label className="text-xs">Date of Birth</Label>
                          <Input
                            type="date"
                            size="sm"
                            value={entity.metadata.dob || ''}
                            onChange={(e) => updateEntity(identifierIndex, entityIndex, 'metadata.dob', e.target.value)}
                          />
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};
