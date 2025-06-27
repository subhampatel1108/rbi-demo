import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Plus, Trash2 } from 'lucide-react';
import { SuspectIdentifier, Entity } from '@/components/ReportManagement';

interface SuspectIdentifierFormProps {
  suspectIdentifiers: SuspectIdentifier[];
  onChange: (identifiers: SuspectIdentifier[]) => void;
}

const SuspectIdentifierForm = ({ suspectIdentifiers, onChange }: SuspectIdentifierFormProps) => {
  const updateIdentifier = (index: number, field: string, value: any) => {
    const newIdentifiers = [...suspectIdentifiers];
    if (field.includes('.')) {
      const [parent, child] = field.split('.');
      const currentIdentifier = newIdentifiers[index];
      const parentObj = currentIdentifier[parent as keyof SuspectIdentifier];
      
      if (parent === 'metadata' && child === 'confidence_score') {
        newIdentifiers[index] = {
          ...currentIdentifier,
          [parent]: {
            ...(typeof parentObj === 'object' && parentObj !== null ? parentObj as Record<string, any> : {}),
            [child]: typeof value === 'string' ? (Number(value) || 0) : value
          }
        };
      } else {
        newIdentifiers[index] = {
          ...currentIdentifier,
          [parent]: {
            ...(typeof parentObj === 'object' && parentObj !== null ? parentObj as Record<string, any> : {}),
            [child]: value
          }
        };
      }
    } else {
      newIdentifiers[index] = { ...newIdentifiers[index], [field]: value };
    }
    onChange(newIdentifiers);
  };

  const updateEntity = (identifierIndex: number, entityIndex: number, field: string, value: any) => {
    const newIdentifiers = [...suspectIdentifiers];
    const newEntities = [...newIdentifiers[identifierIndex].entities];
    
    if (field.includes('.')) {
      const [parent, child] = field.split('.');
      const currentEntity = newEntities[entityIndex];
      const parentObj = currentEntity[parent as keyof Entity];
      
      // Handle numeric fields in metadata
      let processedValue = value;
      if (parent === 'metadata' && child === 'risk_score') {
        processedValue = typeof value === 'string' ? (Number(value) || 0) : value;
      }
      
      newEntities[entityIndex] = {
        ...currentEntity,
        [parent]: {
          ...(typeof parentObj === 'object' && parentObj !== null ? parentObj as Record<string, any> : {}),
          [child]: processedValue
        }
      };
    } else {
      newEntities[entityIndex] = { ...newEntities[entityIndex], [field]: value };
    }
    
    newIdentifiers[identifierIndex] = {
      ...newIdentifiers[identifierIndex],
      entities: newEntities
    };
    onChange(newIdentifiers);
  };

  const addIdentifier = () => {
    const newIdentifiers = [...suspectIdentifiers];
    newIdentifiers.push({
      id: `ID${String(suspectIdentifiers.length + 1).padStart(3, '0')}`,
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
    });
    onChange(newIdentifiers);
  };

  const removeIdentifier = (index: number) => {
    if (suspectIdentifiers.length > 1) {
      const newIdentifiers = suspectIdentifiers.filter((_, i) => i !== index);
      onChange(newIdentifiers);
    }
  };

  const addEntity = (identifierIndex: number) => {
    const newIdentifiers = [...suspectIdentifiers];
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
    onChange(newIdentifiers);
  };

  const removeEntity = (identifierIndex: number, entityIndex: number) => {
    const newIdentifiers = [...suspectIdentifiers];
    if (newIdentifiers[identifierIndex].entities.length > 1) {
      newIdentifiers[identifierIndex].entities = newIdentifiers[identifierIndex].entities.filter((_, i) => i !== entityIndex);
      onChange(newIdentifiers);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">Suspect Identifiers</h3>
        <Button onClick={addIdentifier} size="sm">
          <Plus className="h-4 w-4 mr-2" />
          Add Identifier
        </Button>
      </div>

      {suspectIdentifiers.map((identifier, index) => (
        <Card key={index}>
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle className="text-base">Suspect Identifier {index + 1}</CardTitle>
              <Button
                onClick={() => removeIdentifier(index)}
                variant="outline"
                size="sm"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="basic">
              <TabsList>
                <TabsTrigger value="basic">Basic Info</TabsTrigger>
                <TabsTrigger value="metadata">Metadata</TabsTrigger>
                <TabsTrigger value="entities">Entities</TabsTrigger>
              </TabsList>

              <TabsContent value="basic" className="space-y-4">
                {/* Basic identifier fields */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor={`identity-${index}`}>Identity</Label>
                    <Input
                      id={`identity-${index}`}
                      value={identifier.identity}
                      onChange={(e) => updateIdentifier(index, 'identity', e.target.value)}
                      placeholder="Enter identity"
                    />
                  </div>
                  <div>
                    <Label htmlFor={`identity-type-${index}`}>Identity Type</Label>
                    <Select
                      value={identifier.identity_type}
                      onValueChange={(value) => updateIdentifier(index, 'identity_type', value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select identity type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="phone">Phone</SelectItem>
                        <SelectItem value="email">Email</SelectItem>
                        <SelectItem value="account">Account</SelectItem>
                        <SelectItem value="card">Card</SelectItem>
                        <SelectItem value="upi">UPI</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {/* More basic fields */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor={`status-${index}`}>Status</Label>
                    <Select
                      value={identifier.status}
                      onValueChange={(value) => updateIdentifier(index, 'status', value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="active">Active</SelectItem>
                        <SelectItem value="blocked">Blocked</SelectItem>
                        <SelectItem value="suspended">Suspended</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor={`fraud-type-${index}`}>Fraud Type</Label>
                    <Input
                      id={`fraud-type-${index}`}
                      value={identifier.fraud_type}
                      onChange={(e) => updateIdentifier(index, 'fraud_type', e.target.value)}
                      placeholder="Enter fraud type"
                    />
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="metadata" className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor={`geo-tag-${index}`}>Geo Tag</Label>
                    <Input
                      id={`geo-tag-${index}`}
                      value={identifier.metadata.geo_tag || ''}
                      onChange={(e) => updateIdentifier(index, 'metadata.geo_tag', e.target.value)}
                      placeholder="Enter geo tag"
                    />
                  </div>
                  <div>
                    <Label htmlFor={`confidence-score-${index}`}>Confidence Score</Label>
                    <Input
                      id={`confidence-score-${index}`}
                      type="number"
                      value={identifier.metadata.confidence_score || ''}
                      onChange={(e) => updateIdentifier(index, 'metadata.confidence_score', Number(e.target.value) || 0)}
                      placeholder="Enter confidence score"
                    />
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="entities" className="space-y-4">
                <div className="flex justify-between items-center">
                  <h4 className="font-medium">Entities</h4>
                  <Button onClick={() => addEntity(index)} size="sm">
                    <Plus className="h-4 w-4 mr-2" />
                    Add Entity
                  </Button>
                </div>

                {identifier.entities.map((entity, entityIndex) => (
                  <Card key={entityIndex}>
                    <CardContent className="pt-4">
                      <div className="flex justify-between items-center mb-4">
                        <h5 className="font-medium">Entity {entityIndex + 1}</h5>
                        <Button
                          onClick={() => removeEntity(index, entityIndex)}
                          variant="outline"
                          size="sm"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor={`entity-type-${index}-${entityIndex}`}>Entity Type</Label>
                          <Select
                            value={entity.entity_type}
                            onValueChange={(value) => updateEntity(index, entityIndex, 'entity_type', value)}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Select entity type" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="individual">Individual</SelectItem>
                              <SelectItem value="business">Business</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div>
                          <Label htmlFor={`risk-score-${index}-${entityIndex}`}>Risk Score</Label>
                          <Input
                            id={`risk-score-${index}-${entityIndex}`}
                            type="number"
                            value={entity.metadata.risk_score || ''}
                            onChange={(e) => updateEntity(index, entityIndex, 'metadata.risk_score', Number(e.target.value) || 0)}
                            placeholder="Enter risk score"
                          />
                        </div>
                      </div>

                      {entity.entity_type === 'business' && (
                        <div className="grid grid-cols-2 gap-4 mt-4">
                          <div>
                            <Label htmlFor={`business-name-${index}-${entityIndex}`}>Business Name</Label>
                            <Input
                              id={`business-name-${index}-${entityIndex}`}
                              value={entity.metadata.business_name || ''}
                              onChange={(e) => updateEntity(index, entityIndex, 'metadata.business_name', e.target.value)}
                              placeholder="Enter business name"
                            />
                          </div>
                          <div>
                            <Label htmlFor={`registration-number-${index}-${entityIndex}`}>Registration Number</Label>
                            <Input
                              id={`registration-number-${index}-${entityIndex}`}
                              value={entity.metadata.registration_number || ''}
                              onChange={(e) => updateEntity(index, entityIndex, 'metadata.registration_number', e.target.value)}
                              placeholder="Enter registration number"
                            />
                          </div>
                        </div>
                      )}

                      {entity.entity_type === 'individual' && (
                        <div className="grid grid-cols-2 gap-4 mt-4">
                          <div>
                            <Label htmlFor={`full-name-${index}-${entityIndex}`}>Full Name</Label>
                            <Input
                              id={`full-name-${index}-${entityIndex}`}
                              value={entity.metadata.full_name || ''}
                              onChange={(e) => updateEntity(index, entityIndex, 'metadata.full_name', e.target.value)}
                              placeholder="Enter full name"
                            />
                          </div>
                          <div>
                            <Label htmlFor={`dob-${index}-${entityIndex}`}>Date of Birth</Label>
                            <Input
                              id={`dob-${index}-${entityIndex}`}
                              type="date"
                              value={entity.metadata.dob || ''}
                              onChange={(e) => updateEntity(index, entityIndex, 'metadata.dob', e.target.value)}
                            />
                          </div>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default SuspectIdentifierForm;
