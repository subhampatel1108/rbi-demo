
import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Plus, Trash2 } from 'lucide-react';
import { Report } from '@/components/ReportManagement';

interface PartyRoleFormProps {
  formData: Omit<Report, 'created_at'>;
  setFormData: (data: Omit<Report, 'created_at'>) => void;
}

export const PartyRoleForm = ({ formData, setFormData }: PartyRoleFormProps) => {
  const addPartyRole = () => {
    setFormData({
      ...formData,
      party_roles: [
        ...formData.party_roles,
        {
          party_id: `PARTY${String(formData.party_roles.length + 1).padStart(3, '0')}`,
          role: 'SOURCE',
          status: 'PENDING_VERIFICATION',
          metadata: {
            source_name: '',
            source_type: 'BANK',
            location: '',
            principal_officer: {
              name: '',
              designation: '',
              email: '',
              phone: ''
            },
            branch: {
              branch_name: '',
              branch_bsr_code: '',
              branch_fiu_id: '',
              branch_ifsc_code: '',
              branch_address: '',
              branch_city: '',
              branch_state: '',
              branch_pin: '',
              branch_telephone: '',
              branch_email: ''
            },
            report_format: 'STR',
            submitted_at: new Date().toISOString()
          }
        }
      ]
    });
  };

  const removePartyRole = (index: number) => {
    if (formData.party_roles.length > 1) {
      const newParties = formData.party_roles.filter((_, i) => i !== index);
      setFormData({ ...formData, party_roles: newParties });
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">Party Roles</h3>
        <Button type="button" onClick={addPartyRole} size="sm">
          <Plus className="h-4 w-4 mr-2" />
          Add Party
        </Button>
      </div>

      {formData.party_roles.map((party, index) => (
        <Card key={index}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm">Party {index + 1}</CardTitle>
            {formData.party_roles.length > 1 && (
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => removePartyRole(index)}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            )}
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label>Party ID</Label>
                <Input
                  value={party.party_id}
                  onChange={(e) => {
                    const newParties = [...formData.party_roles];
                    newParties[index].party_id = e.target.value;
                    setFormData({ ...formData, party_roles: newParties });
                  }}
                />
              </div>
              <div className="space-y-2">
                <Label>Role</Label>
                <Select 
                  value={party.role} 
                  onValueChange={(value) => {
                    const newParties = [...formData.party_roles];
                    newParties[index].role = value;
                    setFormData({ ...formData, party_roles: newParties });
                  }}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="SOURCE">Source</SelectItem>
                    <SelectItem value="CHANNEL">Channel</SelectItem>
                    <SelectItem value="VALIDATOR">Validator</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Status</Label>
                <Select 
                  value={party.status} 
                  onValueChange={(value) => {
                    const newParties = [...formData.party_roles];
                    newParties[index].status = value;
                    setFormData({ ...formData, party_roles: newParties });
                  }}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="VERIFIED">Verified</SelectItem>
                    <SelectItem value="PENDING_VERIFICATION">Pending Verification</SelectItem>
                    <SelectItem value="REJECTED">Rejected</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
                <Label>Source Type</Label>
                <Select 
                  value={party.metadata.source_type} 
                  onValueChange={(value) => {
                    const newParties = [...formData.party_roles];
                    newParties[index].metadata.source_type = value;
                    setFormData({ ...formData, party_roles: newParties });
                  }}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="BANK">Bank</SelectItem>
                    <SelectItem value="NBFC">NBFC</SelectItem>
                    <SelectItem value="PAYMENT_GATEWAY">Payment Gateway</SelectItem>
                  </SelectContent>
                </Select>
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

            <h4 className="text-md font-semibold">Principal Officer</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Name</Label>
                <Input
                  value={party.metadata.principal_officer.name}
                  onChange={(e) => {
                    const newParties = [...formData.party_roles];
                    newParties[index].metadata.principal_officer.name = e.target.value;
                    setFormData({ ...formData, party_roles: newParties });
                  }}
                />
              </div>
              <div className="space-y-2">
                <Label>Designation</Label>
                <Input
                  value={party.metadata.principal_officer.designation}
                  onChange={(e) => {
                    const newParties = [...formData.party_roles];
                    newParties[index].metadata.principal_officer.designation = e.target.value;
                    setFormData({ ...formData, party_roles: newParties });
                  }}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Email</Label>
                <Input
                  type="email"
                  value={party.metadata.principal_officer.email}
                  onChange={(e) => {
                    const newParties = [...formData.party_roles];
                    newParties[index].metadata.principal_officer.email = e.target.value;
                    setFormData({ ...formData, party_roles: newParties });
                  }}
                />
              </div>
              <div className="space-y-2">
                <Label>Phone</Label>
                <Input
                  value={party.metadata.principal_officer.phone}
                  onChange={(e) => {
                    const newParties = [...formData.party_roles];
                    newParties[index].metadata.principal_officer.phone = e.target.value;
                    setFormData({ ...formData, party_roles: newParties });
                  }}
                />
              </div>
            </div>

            <h4 className="text-md font-semibold">Branch Details</h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label>Branch Name</Label>
                <Input
                  value={party.metadata.branch.branch_name}
                  onChange={(e) => {
                    const newParties = [...formData.party_roles];
                    newParties[index].metadata.branch.branch_name = e.target.value;
                    setFormData({ ...formData, party_roles: newParties });
                  }}
                />
              </div>
              <div className="space-y-2">
                <Label>BSR Code</Label>
                <Input
                  value={party.metadata.branch.branch_bsr_code}
                  onChange={(e) => {
                    const newParties = [...formData.party_roles];
                    newParties[index].metadata.branch.branch_bsr_code = e.target.value;
                    setFormData({ ...formData, party_roles: newParties });
                  }}
                />
              </div>
              <div className="space-y-2">
                <Label>FIU ID</Label>
                <Input
                  value={party.metadata.branch.branch_fiu_id}
                  onChange={(e) => {
                    const newParties = [...formData.party_roles];
                    newParties[index].metadata.branch.branch_fiu_id = e.target.value;
                    setFormData({ ...formData, party_roles: newParties });
                  }}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label>IFSC Code</Label>
                <Input
                  value={party.metadata.branch.branch_ifsc_code}
                  onChange={(e) => {
                    const newParties = [...formData.party_roles];
                    newParties[index].metadata.branch.branch_ifsc_code = e.target.value;
                    setFormData({ ...formData, party_roles: newParties });
                  }}
                />
              </div>
              <div className="space-y-2">
                <Label>City</Label>
                <Input
                  value={party.metadata.branch.branch_city}
                  onChange={(e) => {
                    const newParties = [...formData.party_roles];
                    newParties[index].metadata.branch.branch_city = e.target.value;
                    setFormData({ ...formData, party_roles: newParties });
                  }}
                />
              </div>
              <div className="space-y-2">
                <Label>State</Label>
                <Input
                  value={party.metadata.branch.branch_state}
                  onChange={(e) => {
                    const newParties = [...formData.party_roles];
                    newParties[index].metadata.branch.branch_state = e.target.value;
                    setFormData({ ...formData, party_roles: newParties });
                  }}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>PIN Code</Label>
                <Input
                  value={party.metadata.branch.branch_pin}
                  onChange={(e) => {
                    const newParties = [...formData.party_roles];
                    newParties[index].metadata.branch.branch_pin = e.target.value;
                    setFormData({ ...formData, party_roles: newParties });
                  }}
                />
              </div>
              <div className="space-y-2">
                <Label>Report Format</Label>
                <Select 
                  value={party.metadata.report_format} 
                  onValueChange={(value) => {
                    const newParties = [...formData.party_roles];
                    newParties[index].metadata.report_format = value;
                    setFormData({ ...formData, party_roles: newParties });
                  }}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="STR">STR</SelectItem>
                    <SelectItem value="CTR">CTR</SelectItem>
                    <SelectItem value="NTR">NTR</SelectItem>
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
