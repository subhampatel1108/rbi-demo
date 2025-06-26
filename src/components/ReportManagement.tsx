
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Plus, FileText } from 'lucide-react';
import CreateReportForm from '@/components/CreateReportForm';
import BulkReportForm from '@/components/BulkReportForm';
import ReportList from '@/components/ReportList';
import ReportDetails from '@/components/ReportDetails';

export interface SuspectIdentifier {
  id: string;
  identity: string;
  identity_type: string;
  status: string;
  recommended_status: string;
  fraud_type: string;
  rule_id?: string;
  linked_entity_id: string;
  linked_parties: string[];
  metadata: {
    geo_tag?: string;
    device_id?: string;
    imei?: string;
    ip_address?: string;
    confidence_score?: number;
    date_of_sending_report?: string;
  };
}

export interface PartyRole {
  party_id: string;
  role: string;
  status: string;
  metadata: {
    source_name: string;
    source_type: string;
    location: string;
    principal_officer: {
      name: string;
      designation: string;
      email: string;
      phone: string;
    };
    branch: {
      branch_name: string;
      branch_bsr_code: string;
      branch_fiu_id: string;
      branch_ifsc_code: string;
      branch_address: string;
      branch_city: string;
      branch_state: string;
      branch_pin: string;
      branch_telephone: string;
      branch_email: string;
    };
    report_format: string;
    submitted_at: string;
  };
}

export interface Entity {
  id: string;
  entity_type: string;
  linked_identifiers: string[];
  parent_entity?: string;
  metadata: {
    business_name?: string;
    registration_number?: string;
    jurisdiction?: string;
    risk_score?: number;
    full_name?: string;
    dob?: string;
    nationality?: string;
  };
  created_at?: string;
}

export interface Rule {
  id: string;
  rule_name: string;
  rule_details: {
    expression: string;
    source: string;
    category: string;
  };
  created_at: string;
}

export interface Report {
  id: string;
  report_name: string;
  suspect_identifiers: SuspectIdentifier[];
  report_type: string;
  fraud_type: string;
  reported_identifier_status: string;
  reported_severity: string;
  report_object_url: {
    screenshot?: string;
    pdf?: string;
  };
  reason_to_flag: string;
  action_taken: string;
  linked_report_ids: string[];
  metadata: {
    reported_by_customer: boolean;
    attempted_fraud: boolean;
    instrument_used: string;
    payment_system_category: string;
    system_involved: string;
    payment_channel: string;
    nature_of_transaction: string;
    utr: string;
    amount_involved: number;
    amount_recovered: number;
    insurance_covered: boolean;
    is_domestic: boolean;
    occurrence_date_by_entity: string;
    detection_date_by_entity: string;
    entry_date_by_entity: string;
    report_date_by_customer: string;
    time_of_occurrence: string;
    beneficiary: {
      name: string;
      upi_id: string;
      bank: string;
      account_number: string;
      ifsc: string;
    };
    registered_with_lea: boolean;
    lea_case_details: string;
    is_closed: boolean;
    modus_operandi: string[];
    future_steps: string;
  };
  reported_at: string;
  created_at: string;
  party_roles: PartyRole[];
  entities: Entity[];
  rules: Rule[];
}

const ReportManagement = () => {
  const [view, setView] = useState<'list' | 'create' | 'bulk' | 'details'>('list');
  const [selectedReport, setSelectedReport] = useState<Report | null>(null);
  const [reports, setReports] = useState<Report[]>([]);

  const handleCreateReport = (reportData: Omit<Report, 'created_at'>) => {
    const newReport: Report = {
      ...reportData,
      created_at: new Date().toISOString()
    };
    setReports([newReport, ...reports]);
    setView('list');
  };

  const handleBulkCreateReports = (reportsData: Omit<Report, 'created_at'>[]) => {
    const newReports: Report[] = reportsData.map((reportData) => ({
      ...reportData,
      created_at: new Date().toISOString()
    }));
    setReports([...newReports, ...reports]);
    setView('list');
  };

  const handleViewReport = (report: Report) => {
    setSelectedReport(report);
    setView('details');
  };

  return (
    <div className="space-y-6">
      {view === 'list' && (
        <>
          <div className="flex justify-between items-center">
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Fraud Reports</h3>
              <p className="text-gray-600">Manage and track fraud reports</p>
            </div>
            <div className="flex space-x-2">
              <Button onClick={() => setView('create')}>
                <Plus className="h-4 w-4 mr-2" />
                Create Report
              </Button>
              <Button onClick={() => setView('bulk')} variant="outline">
                <FileText className="h-4 w-4 mr-2" />
                Bulk Create
              </Button>
            </div>
          </div>
          <ReportList reports={reports} onViewReport={handleViewReport} />
        </>
      )}

      {view === 'create' && (
        <CreateReportForm
          onSubmit={handleCreateReport}
          onCancel={() => setView('list')}
        />
      )}

      {view === 'bulk' && (
        <BulkReportForm
          onSubmit={handleBulkCreateReports}
          onCancel={() => setView('list')}
        />
      )}

      {view === 'details' && selectedReport && (
        <ReportDetails
          report={selectedReport}
          onBack={() => setView('list')}
        />
      )}
    </div>
  );
};

export default ReportManagement;
