import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import CreateDisputeForm from '@/components/CreateDisputeForm';
import DisputeList from '@/components/DisputeList';
import DisputeDetails from '@/components/DisputeDetails';

export interface Dispute {
  id: string;
  disputeId: string;
  reportId: string;
  reason: string;
  description: string;
  status: 'Pending' | 'Under Review' | 'Approved' | 'Rejected' | 'Closed';
  createdAt: string;
  priority: 'Low' | 'Medium' | 'High' | 'Critical';
}

const DisputeManagement = () => {
  const [view, setView] = useState<'list' | 'details'>('list');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [selectedDispute, setSelectedDispute] = useState<Dispute | null>(null);
  const [disputes, setDisputes] = useState<Dispute[]>([
    {
      id: '1',
      disputeId: 'DSP-001',
      reportId: 'FRD-001',
      reason: 'False Positive',
      description: 'This transaction was legitimate and should not be flagged as fraud',
      status: 'Pending',
      createdAt: '2024-01-16T09:30:00Z',
      priority: 'High'
    },
    {
      id: '2',
      disputeId: 'DSP-002',
      reportId: 'FRD-002',
      reason: 'Incomplete Investigation',
      description: 'The investigation was not thorough enough and missed key evidence',
      status: 'Under Review',
      createdAt: '2024-01-15T14:20:00Z',
      priority: 'Medium'
    }
  ]);

  const handleCreateDispute = (disputeData: Omit<Dispute, 'id' | 'createdAt'>) => {
    const newDispute: Dispute = {
      ...disputeData,
      id: Date.now().toString(),
      createdAt: new Date().toISOString()
    };
    setDisputes([newDispute, ...disputes]);
    setIsCreateModalOpen(false);
  };

  const handleViewDispute = (dispute: Dispute) => {
    setSelectedDispute(dispute);
    setView('details');
  };

  return (
    <div className="space-y-6">
      {view === 'list' && (
        <>
          <div className="flex justify-between items-center">
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Dispute Management</h3>
              <p className="text-gray-600">Raise and track disputes for fraud reports</p>
            </div>
            <Button onClick={() => setIsCreateModalOpen(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Raise Dispute
            </Button>
          </div>
          <DisputeList disputes={disputes} onViewDispute={handleViewDispute} />
        </>
      )}

      {view === 'details' && selectedDispute && (
        <DisputeDetails
          dispute={selectedDispute}
          onBack={() => setView('list')}
        />
      )}

      <CreateDisputeForm
        isOpen={isCreateModalOpen}
        onSubmit={handleCreateDispute}
        onCancel={() => setIsCreateModalOpen(false)}
      />
    </div>
  );
};

export default DisputeManagement;
