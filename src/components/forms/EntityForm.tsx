
import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Plus, Trash2 } from 'lucide-react';
import { Report } from '@/components/ReportManagement';

interface EntityFormProps {
  formData: Omit<Report, 'created_at'>;
  setFormData: (data: Omit<Report, 'created_at'>) => void;
}

export const EntityForm = ({ formData, setFormData }: EntityFormProps) => {
  const addEntity = () => {
    setFormData({
      ...formData,
      entities: [
        ...formData.entities,
        {
          id: `ENTITY${String(formData.entities.length + 1).padStart(3, '0')}`,
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
        }
      ]
    });
  };

  const removeEntity = (index: number) => {
    if (formData.entities.length > 1) {
      const newEntities = formData.entities.filter((_, i) => i !== index);
      setFormData({ ...formData, entities: newEntities });
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">Entities</h3>
        <Button type="button" onClick={addEntity} size="sm">
          <Plus className="h-4 w-4 mr-2" />
          Add Entity
        </Button>
      </div>

      {formData.entities.map((entity, index) => (
        <Card key={index}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm">Entity {index + 1}</CardTitle>
            {formData.entities.length > 1 && (
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => removeEntity(index)}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            )}
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label>Entity ID</Label>
                <Input
                  value={entity.id}
                  onChange={(e) => {
                    const newEntities = [...formData.entities];
                    newEntities[index].id = e.target.value;
                    setFormData({ ...formData, entities: newEntities });
                  }}
                />
              </div>
              <div className="space-y-2">
                <Label>Entity Type</Label>
                <Select 
                  value={entity.entity_type} 
                  onValueChange={(value) => {
                    const newEntities = [...formData.entities];
                    newEntities[index].entity_type = value;
                    setFormData({ ...formData, entities: newEntities });
                  }}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="INDIVIDUAL">Individual</SelectItem>
                    <SelectItem value="MERCHANT">Merchant</SelectItem>
                    <SelectItem value="ORGANIZATION">Organization</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Parent Entity</Label>
                <Input
                  value={entity.parent_entity || ''}
                  onChange={(e) => {
                    const newEntities = [...formData.entities];
                    newEntities[index].parent_entity = e.target.value;
                    setFormData({ ...formData, entities: newEntities });
                  }}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label>Linked Identifiers (comma separated)</Label>
              <Input
                value={entity.linked_identifiers.join(', ')}
                onChange={(e) => {
                  const newEntities = [...formData.entities];
                  newEntities[index].linked_identifiers = e.target.value.split(',').map(id => id.trim()).filter(id => id);
                  setFormData({ ...formData, entities: newEntities });
                }}
              />
            </div>

            {entity.entity_type === 'INDIVIDUAL' && (
              <>
                <h4 className="text-md font-semibold">Individual Details</h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label>Full Name</Label>
                    <Input
                      value={entity.metadata.full_name || ''}
                      onChange={(e) => {
                        const newEntities = [...formData.entities];
                        newEntities[index].metadata.full_name = e.target.value;
                        setFormData({ ...formData, entities: newEntities });
                      }}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Date of Birth</Label>
                    <Input
                      type="date"
                      value={entity.metadata.dob || ''}
                      onChange={(e) => {
                        const newEntities = [...formData.entities];
                        newEntities[index].metadata.dob = e.target.value;
                        setFormData({ ...formData, entities: newEntities });
                      }}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Nationality</Label>
                    <Input
                      value={entity.metadata.nationality || ''}
                      onChange={(e) => {
                        const newEntities = [...formData.entities];
                        newEntities[index].metadata.nationality = e.target.value;
                        setFormData({ ...formData, entities: newEntities });
                      }}
                    />
                  </div>
                </div>
              </>
            )}

            {(entity.entity_type === 'MERCHANT' || entity.entity_type === 'ORGANIZATION') && (
              <>
                <h4 className="text-md font-semibold">Business Details</h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label>Business Name</Label>
                    <Input
                      value={entity.metadata.business_name || ''}
                      onChange={(e) => {
                        const newEntities = [...formData.entities];
                        newEntities[index].metadata.business_name = e.target.value;
                        setFormData({ ...formData, entities: newEntities });
                      }}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Registration Number</Label>
                    <Input
                      value={entity.metadata.registration_number || ''}
                      onChange={(e) => {
                        const newEntities = [...formData.entities];
                        newEntities[index].metadata.registration_number = e.target.value;
                        setFormData({ ...formData, entities: newEntities });
                      }}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Jurisdiction</Label>
                    <Input
                      value={entity.metadata.jurisdiction || ''}
                      onChange={(e) => {
                        const newEntities = [...formData.entities];
                        newEntities[index].metadata.jurisdiction = e.target.value;
                        setFormData({ ...formData, entities: newEntities });
                      }}
                    />
                  </div>
                </div>
              </>
            )}

            <div className="space-y-2">
              <Label>Risk Score</Label>
              <Input
                type="number"
                min="0"
                max="100"
                value={entity.metadata.risk_score || 0}
                onChange={(e) => {
                  const newEntities = [...formData.entities];
                  newEntities[index].metadata.risk_score = Number(e.target.value);
                  setFormData({ ...formData, entities: newEntities });
                }}
              />
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};
