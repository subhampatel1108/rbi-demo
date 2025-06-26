
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Checkbox } from '@/components/ui/checkbox';
import { ArrowLeft, Plus, Trash2 } from 'lucide-react';
import { Report, SuspectIdentifier, PartyRole, Entity, Rule } from '@/components/ReportManagement';

interface CreateReportFormProps {
  onSubmit: (report: Omit<Report, 'created_at'>) => void;
  onCancel: () => void;
}

const CreateReportForm = ({ onSubmit, onCancel }: CreateReportFormProps) => {
  const [formData, setFormData] = useState<Omit<Report, 'created_at'>>({
    id: `REPORT${Date.now()}`,
    report_name: '',
    suspect_identifiers: [{
      id: 'ID001',
      identity: '',
      identity_type: 'PAN',
      status: 'ACTIVE',
      recommended_status: 'FRAUD',
      fraud_type: 'KYC',
      linked_entity_id: '',
      linked_parties: [],
      metadata: {}
    }],
    report_type: 'creation',
    fraud_type: 'ACH',
    reported_identifier_status: 'ACTIVE',
    reported_severity: 'HIGH',
    report_object_url: {},
    reason_to_flag: '',
    action_taken: '',
    linked_report_ids: [],
    metadata: {
      reported_by_customer: false,
      attempted_fraud: false,
      instrument_used: 'DEC',
      payment_system_category: 'CAN',
      system_involved: 'VISA',
      payment_channel: 'UPI',
      nature_of_transaction: 'WBC',
      utr: '',
      amount_involved: 0,
      amount_recovered: 0,
      insurance_covered: false,
      is_domestic: true,
      occurrence_date_by_entity: '',
      detection_date_by_entity: '',
      entry_date_by_entity: '',
      report_date_by_customer: '',
      time_of_occurrence: '',
      beneficiary: {
        name: '',
        upi_id: '',
        bank: '',
        account_number: '',
        ifsc: ''
      },
      registered_with_lea: false,
      lea_case_details: '',
      is_closed: false,
      modus_operandi: [],
      future_steps: ''
    },
    reported_at: new Date().toISOString(),
    party_roles: [{
      party_id: 'SRC001',
      role: 'SOURCE',
      status: 'VERIFIED',
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
    }],
    entities: [{
      id: 'ENTITY001',
      entity_type: 'INDIVIDUAL',
      linked_identifiers: [],
      metadata: {}
    }],
    rules: [{
      id: 'RULE001',
      rule_name: '',
      rule_details: {
        expression: '',
        source: 'external-engine',
        category: 'velocity'
      },
      created_at: new Date().toISOString()
    }]
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const updateSuspectIdentifier = (index: number, field: string, value: any) => {
    const newIdentifiers = [...formData.suspect_identifiers];
    if (field.includes('.')) {
      const [parent, child] = field.split('.');
      newIdentifiers[index] = {
        ...newIdentifiers[index],
        [parent]: {
          ...newIdentifiers[index][parent as keyof SuspectIdentifier],
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
          id: `ID${formData.suspect_identifiers.length + 1}`,
          identity: '',
          identity_type: 'PAN',
          status: 'ACTIVE',
          recommended_status: 'FRAUD',
          fraud_type: 'KYC',
          linked_entity_id: '',
          linked_parties: [],
          metadata: {}
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
    <div className="space-y-6">
      <div className="flex items-center space-x-4">
        <Button variant="outline" size="sm" onClick={onCancel}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Reports
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Create New Fraud Report</CardTitle>
          <CardDescription>Fill in the comprehensive fraud report details</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <Tabs defaultValue="basic" className="w-full">
              <TabsList className="grid w-full grid-cols-5">
                <TabsTrigger value="basic">Basic Info</TabsTrigger>
                <TabsTrigger value="identifiers">Identifiers</TabsTrigger>
                <TabsTrigger value="metadata">Metadata</TabsTrigger>
                <TabsTrigger value="parties">Parties</TabsTrigger>
                <TabsTrigger value="entities">Entities</TabsTrigger>
              </TabsList>

              <TabsContent value="basic" className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="id">Report ID</Label>
                    <Input
                      id="id"
                      value={formData.id}
                      onChange={(e) => setFormData({ ...formData, id: e.target.value })}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="report_name">Report Name</Label>
                    <Input
                      id="report_name"
                      value={formData.report_name}
                      onChange={(e) => setFormData({ ...formData, report_name: e.target.value })}
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="fraud_type">Fraud Type</Label>
                    <Select value={formData.fraud_type} onValueChange={(value) => setFormData({ ...formData, fraud_type: value })}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="ACH">ACH</SelectItem>
                        <SelectItem value="UPI">UPI</SelectItem>
                        <SelectItem value="KYC">KYC</SelectItem>
                        <SelectItem value="Credit Card">Credit Card</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="reported_severity">Severity</Label>
                    <Select value={formData.reported_severity} onValueChange={(value) => setFormData({ ...formData, reported_severity: value })}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="LOW">Low</SelectItem>
                        <SelectItem value="MEDIUM">Medium</SelectItem>
                        <SelectItem value="HIGH">High</SelectItem>
                        <SelectItem value="CRITICAL">Critical</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="reason_to_flag">Reason to Flag</Label>
                  <Textarea
                    id="reason_to_flag"
                    value={formData.reason_to_flag}
                    onChange={(e) => setFormData({ ...formData, reason_to_flag: e.target.value })}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="action_taken">Action Taken</Label>
                  <Textarea
                    id="action_taken"
                    value={formData.action_taken}
                    onChange={(e) => setFormData({ ...formData, action_taken: e.target.value })}
                    required
                  />
                </div>
              </TabsContent>

              <TabsContent value="identifiers" className="space-y-4">
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
                    <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
                    </CardContent>
                  </Card>
                ))}
              </TabsContent>

              <TabsContent value="metadata" className="space-y-4">
                <h3 className="text-lg font-semibold">Transaction Metadata</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="utr">UTR</Label>
                    <Input
                      id="utr"
                      value={formData.metadata.utr}
                      onChange={(e) => setFormData({
                        ...formData,
                        metadata: { ...formData.metadata, utr: e.target.value }
                      })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="amount_involved">Amount Involved</Label>
                    <Input
                      id="amount_involved"
                      type="number"
                      value={formData.metadata.amount_involved}
                      onChange={(e) => setFormData({
                        ...formData,
                        metadata: { ...formData.metadata, amount_involved: Number(e.target.value) }
                      })}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="payment_channel">Payment Channel</Label>
                    <Select value={formData.metadata.payment_channel} onValueChange={(value) => setFormData({
                      ...formData,
                      metadata: { ...formData.metadata, payment_channel: value }
                    })}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="UPI">UPI</SelectItem>
                        <SelectItem value="NEFT">NEFT</SelectItem>
                        <SelectItem value="RTGS">RTGS</SelectItem>
                        <SelectItem value="IMPS">IMPS</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="occurrence_date">Occurrence Date</Label>
                    <Input
                      id="occurrence_date"
                      type="date"
                      value={formData.metadata.occurrence_date_by_entity}
                      onChange={(e) => setFormData({
                        ...formData,
                        metadata: { ...formData.metadata, occurrence_date_by_entity: e.target.value }
                      })}
                    />
                  </div>
                </div>

                <h4 className="text-md font-semibold mt-6">Beneficiary Details</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="beneficiary_name">Beneficiary Name</Label>
                    <Input
                      id="beneficiary_name"
                      value={formData.metadata.beneficiary.name}
                      onChange={(e) => setFormData({
                        ...formData,
                        metadata: {
                          ...formData.metadata,
                          beneficiary: { ...formData.metadata.beneficiary, name: e.target.value }
                        }
                      })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="beneficiary_upi">UPI ID</Label>
                    <Input
                      id="beneficiary_upi"
                      value={formData.metadata.beneficiary.upi_id}
                      onChange={(e) => setFormData({
                        ...formData,
                        metadata: {
                          ...formData.metadata,
                          beneficiary: { ...formData.metadata.beneficiary, upi_id: e.target.value }
                        }
                      })}
                    />
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="reported_by_customer"
                      checked={formData.metadata.reported_by_customer}
                      onCheckedChange={(checked) => setFormData({
                        ...formData,
                        metadata: { ...formData.metadata, reported_by_customer: checked as boolean }
                      })}
                    />
                    <Label htmlFor="reported_by_customer">Reported by Customer</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="registered_with_lea"
                      checked={formData.metadata.registered_with_lea}
                      onCheckedChange={(checked) => setFormData({
                        ...formData,
                        metadata: { ...formData.metadata, registered_with_lea: checked as boolean }
                      })}
                    />
                    <Label htmlFor="registered_with_lea">Registered with LEA</Label>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="parties" className="space-y-4">
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
              </TabsContent>

              <TabsContent value="entities" className="space-y-4">
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
              </TabsContent>
            </Tabs>

            <div className="flex space-x-4 pt-4">
              <Button type="submit">Create Report</Button>
              <Button type="button" variant="outline" onClick={onCancel}>
                Cancel
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default CreateReportForm;
