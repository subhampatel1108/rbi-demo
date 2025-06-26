import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Plus, FileText } from 'lucide-react';
import CreateReportForm from '@/components/CreateReportForm';
import BulkReportForm from '@/components/BulkReportForm';
import ReportList from '@/components/ReportList';
import ReportDetails from '@/components/ReportDetails';

export interface Report {
  id: string;
  fraudId: string;
  idType: string;
  metadata: string;
  status: 'Open' | 'Under Investigation' | 'Resolved' | 'Closed';
  createdAt: string;
  description: string;
}

const ReportManagement = () => {
  const [view, setView] = useState<'list' | 'create' | 'bulk' | 'details'>('list');
  const [selectedReport, setSelectedReport] = useState<Report | null>(null);
  const [reports, setReports] = useState<Report[]>([
    {
      id: '1',
      fraudId: 'FRD-001',
      idType: 'SSN',
      metadata: '{"ip": "192.168.1.1", "device": "mobile"}',
      status: 'Open',
      createdAt: '2024-01-15T10:30:00Z',
      description: 'Suspicious transaction detected'
    },
    {
      id: '2',
      fraudId: 'FRD-002',
      idType: 'Email',
      metadata: '{"location": "NYC", "amount": "$500"}',
      status: 'Under Investigation',
      createdAt: '2024-01-14T15:45:00Z',
      description: 'Multiple failed login attempts'
    }
  ]);

  const handleCreateReport = (reportData: Omit<Report, 'id' | 'createdAt'>) => {
    const newReport: Report = {
      ...reportData,
      id: Date.now().toString(),
      createdAt: new Date().toISOString()
    };
    setReports([newReport, ...reports]);
    setView('list');
  };

  const handleBulkCreateReports = (reportsData: Omit<Report, 'id' | 'createdAt'>[]) => {
    const newReports: Report[] = reportsData.map((reportData, index) => ({
      ...reportData,
      id: (Date.now() + index).toString(),
      createdAt: new Date().toISOString()
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
