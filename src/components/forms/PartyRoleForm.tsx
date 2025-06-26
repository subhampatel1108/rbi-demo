
import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Report } from '@/components/ReportManagement';

interface PartyRoleFormProps {
  formData: Omit<Report, 'created_at'>;
  setFormData: (data: Omit<Report, 'created_at'>) => void;
}

export const PartyRoleForm = ({ formData, setFormData }: PartyRoleFormProps) => {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">Party Roles</h3>
      {formData.party_roles.map((party, index) => (
        <Card key={index}>
          <CardHeader>
            <CardTitle className="text-sm">Party {index + 1}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Source Name</Label>
                <Input
                  value={party.metadata.source_name}
                  onChange={(e) => {
                    const newParties = [...formData.party_roles];
                    newParties[index].metadata.source_name = e.target.value;
                    setFormData({ ...formData, party_roles: newParties });
                  }}
                />
              </div>
              <div className="space-y-2">
                <Label>Location</Label>
                <Input
                  value={party.metadata.location}
                  onChange={(e) => {
                    const newParties = [...formData.party_roles];
                    newParties[index].metadata.location = e.target.value;
                    setFormData({ ...formData, party_roles: newParties });
                  }}
                />
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};
