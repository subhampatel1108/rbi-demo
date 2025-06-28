import React, { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import CreateDisputeForm from '@/components/CreateDisputeForm';
import DisputeList from '@/components/DisputeList';
import DisputeDetails from '@/components/DisputeDetails';
import { MOCK_MODE, getMockResponse, ApiDispute, ApiResponse } from '@/utils/mockData';

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
  const { email } = useAuth();
  const { toast } = useToast();
  const [view, setView] = useState<'list' | 'details'>('list');
  const [activeTab, setActiveTab] = useState<'raised-by-us' | 'raised-against-us'>('raised-by-us');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [selectedDispute, setSelectedDispute] = useState<Dispute | null>(null);
  const [disputes, setDisputes] = useState<Dispute[]>([]);
  const [loading, setLoading] = useState(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const extractDomain = (email: string) => {
    if (!email || !email.includes('@')) return '';
    const fullDomain = email.split('@')[1];
    return fullDomain.split('.')[0];
  };

  const convertApiDisputeToDispute = (apiDispute: ApiDispute): Dispute => {
    return {
      id: apiDispute.dispute_id,
      disputeId: apiDispute.dispute_id,
      reportId: apiDispute.dispute_id,
      reason: apiDispute.reason,
      description: apiDispute.reason,
      status: apiDispute.status === 'PENDING' ? 'Pending' : 
              apiDispute.status === 'RESOLVED' ? 'Closed' : 'Under Review',
      createdAt: apiDispute.raised_at,
      priority: apiDispute.priority || 'Medium'
    };
  };

  const fetchDisputes = async (forceUpdate = false) => {
    const emailDomain = extractDomain(email);
    if (!emailDomain) return;
    if(forceUpdate) {
      setLoading(true);
    }
    try {
      let data: ApiResponse;
      
      if (MOCK_MODE) {
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 300));
        data = getMockResponse(activeTab);
      } else {
        const baseUrl = activeTab === 'raised-against-us' 
          ? `http://localhost:3000/disputes/assigned?party_id=${emailDomain}`
          : `http://localhost:3000/disputes?party_id=${emailDomain}`;
        
        const response = await fetch(baseUrl);
        if (response.ok) {
          data = await response.json();
        } else {
          console.error('Failed to fetch disputes:', response.statusText);
          return;
        }
      }

      const convertedDisputes = data.disputes.map(convertApiDisputeToDispute);
      
      // Always update on force update (tab switch) or if data actually changed
      if (forceUpdate) {
        setDisputes(convertedDisputes);
        toast({
          title: "Updates Detected!",
          variant: "info",
        });
      } else {
        // Check if disputes have changed for polling updates
        setDisputes(currentDisputes => {
          const disputesHaveChanged = (newDisputes: Dispute[], currentDisputes: Dispute[]) => {
            if (newDisputes.length !== currentDisputes.length) return true;
            return newDisputes.some((newDispute, index) => {
              const currentDispute = currentDisputes[index];
              return !currentDispute || 
                     newDispute.id !== currentDispute.id || 
                     newDispute.status !== currentDispute.status || 
                     newDispute.reason !== currentDispute.reason;
            });
          };

          if (disputesHaveChanged(convertedDisputes, currentDisputes)) {
            toast({
              title: "Updates Detected!",
              variant: "info",
            });
            return convertedDisputes;
          }
          return currentDisputes;
        });
      }
    } catch (error) {
      console.error('Error fetching disputes:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleTabChange = (newTab: 'raised-by-us' | 'raised-against-us') => {
    if (newTab === activeTab) return; // Don't do anything if same tab
    
    // Clear current interval
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
    
    // Clear current disputes immediately to show loading state
    setDisputes([]);
    setActiveTab(newTab);
  };

  useEffect(() => {
    const emailDomain = extractDomain(email);
    if (!emailDomain) return;

    // Clear any existing interval
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }

    // Initial fetch with force update
    fetchDisputes(true);

    // Set up polling every 6 seconds
    intervalRef.current = setInterval(() => fetchDisputes(false), 6000);

    // Cleanup interval on unmount or dependency change
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [email, activeTab]);

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
          {/* Tabs and Button Row */}
          <div className="flex justify-between items-center mb-4">
            <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg w-fit">
              <button
                onClick={() => handleTabChange('raised-by-us')}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                  activeTab === 'raised-by-us'
                    ? 'bg-white text-gray-900 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Disputes Raised by Us
              </button>
              <button
                onClick={() => handleTabChange('raised-against-us')}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                  activeTab === 'raised-against-us'
                    ? 'bg-white text-gray-900 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Disputes Raised Against Us
              </button>
            </div>
            <Button onClick={() => setIsCreateModalOpen(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Raise Dispute
            </Button>
          </div>

          {loading ? (
            <div className="flex justify-center py-8">
              <div className="text-gray-500">Loading disputes...</div>
            </div>
          ) : (
            <DisputeList disputes={disputes} onViewDispute={handleViewDispute} />
          )}
        </>
      )}

      {view === 'details' && selectedDispute && (
        <DisputeDetails
          dispute={selectedDispute}
          onBack={() => setView('list')}
          activeTab={activeTab}
          onActionComplete={() => fetchDisputes(true)}
        />
      )}

      <CreateDisputeForm
        isOpen={isCreateModalOpen}
        onSubmit={handleCreateDispute}
        onCancel={() => setIsCreateModalOpen(false)}
        onSuccess={() => fetchDisputes(true)}
      />
    </div>
  );
};

export default DisputeManagement;
