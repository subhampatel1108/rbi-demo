import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ArrowLeft } from 'lucide-react';
import { Report } from '@/components/ReportManagement';
import { BasicInfoForm } from './forms/BasicInfoForm';
import { SuspectIdentifierForm } from './forms/SuspectIdentifierForm';
import { PartyRoleForm } from './forms/PartyRoleForm';
import { EntityForm } from './forms/EntityForm';
import { MetadataForm } from './forms/MetadataForm';

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
    }],
    report_type: 'creation',
    fraud_type: 'ACH',
    reported_identifier_status: 'ACTIVE',
    reported_severity: 'HIGH',
    report_object_url: {
      screenshot: '',
      pdf: ''
    },
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

  const handleFormDataUpdate = (newData: Omit<Report, 'created_at'>) => {
    setFormData(newData);
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
                <TabsTrigger value="sources">Source Details</TabsTrigger>
                <TabsTrigger value="entities">Entities</TabsTrigger>
                <TabsTrigger value="metadata">Metadata</TabsTrigger>
              </TabsList>

              <TabsContent value="basic" className="space-y-4">
                <BasicInfoForm formData={formData} setFormData={handleFormDataUpdate} />
              </TabsContent>

              <TabsContent value="identifiers" className="space-y-4">
                <SuspectIdentifierForm formData={formData} setFormData={handleFormDataUpdate} />
              </TabsContent>

              <TabsContent value="sources" className="space-y-4">
                <PartyRoleForm formData={formData} setFormData={handleFormDataUpdate} />
              </TabsContent>

              <TabsContent value="entities" className="space-y-4">
                <EntityForm formData={formData} setFormData={handleFormDataUpdate} />
              </TabsContent>

              <TabsContent value="metadata" className="space-y-4">
                <MetadataForm formData={formData} setFormData={handleFormDataUpdate} />
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
