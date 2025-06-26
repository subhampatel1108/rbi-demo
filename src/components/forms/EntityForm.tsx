
import React from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Report } from '@/components/ReportManagement';

interface EntityFormProps {
  formData: Omit<Report, 'created_at'>;
  setFormData: (data: Omit<Report, 'created_at'>) => void;
}

export const EntityForm = ({ formData, setFormData }: EntityFormProps) => {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">Entities</h3>
      {formData.entities.map((entity, index) => (
        <Card key={index}>
          <CardHeader>
            <CardTitle className="text-sm">Entity {index + 1}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};
