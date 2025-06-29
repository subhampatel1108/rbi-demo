import React, { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import CreateDisputeForm from '@/components/CreateDisputeForm';
import DisputeList from '@/components/DisputeList';
import DisputeDetails from '@/components/DisputeDetails';
import TableSkeleton from '@/components/ui/TableSkeleton';
import { MOCK_MODE, getMockResponse, ApiDispute, ApiResponse, ApiIdentifier } from '@/utils/mockData';
import { API_CONFIG, API_ENDPOINTS } from '@/constants';

export interface Identifier {
  identifier_id: string;
  identity_type: string;
  reason: string;
}

export interface Dispute {
  id: string;
  disputeId: string;
  reportId: string;
  reason: string;
  description: string;
  status: 'PENDING' | 'RESOLVED' | 'REJECTED' | 'INFO_REQUESTED';
  createdAt: string;
  priority: 'Low' | 'Medium' | 'High' | 'Critical';
  identities: Identifier[];
}

const DisputeManagement = () => {
  const { email, emailDomain } = useAuth();
  const { toast } = useToast();
  const [view, setView] = useState<'list' | 'details'>('list');
  const [activeTab, setActiveTab] = useState<'raised-by-us' | 'raised-against-us'>('raised-by-us');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [selectedDispute, setSelectedDispute] = useState<Dispute | null>(null);
  const [disputes, setDisputes] = useState<Dispute[]>([]);
  const [loading, setLoading] = useState(false);
  const [newlyCreatedDisputes, setNewlyCreatedDisputes] = useState<Set<string>>(new Set());
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const abortControllerRef = useRef<AbortController | null>(null);
  const [showUpdateIndicator, setShowUpdateIndicator] = useState(false);

  // Subtle update indicator component
  const UpdateIndicator = () => {
    return (
      <div 
        className={`fixed bottom-6 right-6 z-[9999] w-4 h-4 bg-blue-500 rounded-full transition-opacity duration-[800ms] ease-in-out pointer-events-none ${
          showUpdateIndicator ? 'opacity-100' : 'opacity-0'
        }`}
      />
    );
  };

  // Function to show subtle update notification
  const showUpdateNotification = () => {
    setShowUpdateIndicator(true);
    setTimeout(() => {
      setShowUpdateIndicator(false);
    }, 2000); // Show for 2 seconds instead of 1
  };

  const getToastStyle = (domain: string) => {
    switch (domain.toLowerCase()) {
      case 'hdfc':
        return 'border-[#B9DCFF] bg-[#B9DCFF] text-blue-900';
      case 'icici':
        return 'border-[#F8C6C7] bg-[#F8C6C7] text-red-900';
      default:
        return 'border-blue-200 bg-blue-50 text-blue-900'; // Default info style
    }
  };

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
      status: apiDispute.status as any,
      createdAt: apiDispute.raised_at,
      priority: apiDispute.priority || 'Medium',
      identities: apiDispute.identities || []
    };
  };

  const fetchDisputes = async (forceUpdate = false) => {
    const emailDomain = extractDomain(email);
    if (!emailDomain) return;
    
    // Cancel any previous pending request
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    
    // Create new AbortController for this request
    const abortController = new AbortController();
    abortControllerRef.current = abortController;
    
    if(forceUpdate) {
      setLoading(true);
    }
    
    try {
      let data: ApiResponse;
      
      if (MOCK_MODE) {
        // Simulate API delay
        await new Promise((resolve, reject) => {
          const timeout = setTimeout(resolve, 300);
          abortController.signal.addEventListener('abort', () => {
            clearTimeout(timeout);
            reject(new DOMException('Request aborted', 'AbortError'));
          });
        });
        
        // Check if request was aborted before proceeding
        if (abortController.signal.aborted) {
          throw new DOMException('Request aborted', 'AbortError');
        }
        
        data = getMockResponse(activeTab);
      } else {
        const baseUrl = activeTab === 'raised-against-us' 
          ? `${API_CONFIG.DISPUTES_HOSTNAME}${API_ENDPOINTS.GET_ASSIGNED_DISPUTES}?party_id=${emailDomain}`
          : `${API_CONFIG.DISPUTES_HOSTNAME}${API_ENDPOINTS.GET_DISPUTES}?party_id=${emailDomain}`;
        
        const response = await fetch(baseUrl, {
          signal: abortController.signal
        });
        
        if (response.ok) {
          data = await response.json();
        } else {
          console.error('Failed to fetch disputes:', response.statusText);
          return;
        }
      }

      // Check if this request is still the current one (not aborted by a newer request)
      if (abortController.signal.aborted || abortControllerRef.current !== abortController) {
        return; // Ignore this response as it's outdated
      }

      const convertedDisputes = data.disputes.map(convertApiDisputeToDispute);
      
      // Sort disputes by dispute ID to prevent UI jumping from erratic backend order
      convertedDisputes.sort((a, b) => a.disputeId.localeCompare(b.disputeId));
      
      // Always update on force update (tab switch) or if data actually changed
      if (forceUpdate) {
        setDisputes(convertedDisputes);
        showUpdateNotification();
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
            showUpdateNotification();
            return convertedDisputes;
          }
          return currentDisputes;
        });
      }
    } catch (error) {
      // Only log errors that aren't from aborted requests
      if (error instanceof DOMException && error.name === 'AbortError') {
        console.log('Request aborted (newer request initiated)');
      } else {
        console.error('Error fetching disputes:', error);
      }
    } finally {
      // Only set loading to false if this is still the current request
      if (abortControllerRef.current === abortController) {
        setLoading(false);
      }
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

    // Clear any existing interval and abort any pending request
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    // Initial fetch with force update
    fetchDisputes(true);

    // Set up polling every 6 seconds
    intervalRef.current = setInterval(() => fetchDisputes(false), 6000);

    // Cleanup interval and abort any pending request on unmount or dependency change
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, [email, activeTab]);

  // Update selectedDispute when disputes array changes and we have a selected dispute
  useEffect(() => {
    if (selectedDispute && disputes.length > 0) {
      const updatedDispute = disputes.find(d => d.id === selectedDispute.id);
      if (updatedDispute && JSON.stringify(updatedDispute) !== JSON.stringify(selectedDispute)) {
        setSelectedDispute(updatedDispute);
      }
    }
  }, [disputes, selectedDispute]);

  const handleCreateDispute = (disputeData: Omit<Dispute, 'id' | 'createdAt'>) => {
    const newDispute: Dispute = {
      ...disputeData,
      id: Date.now().toString(),
      createdAt: new Date().toISOString()
    };
    
    // Add to disputes list
    setDisputes([newDispute, ...disputes]);
    
    // Mark as newly created for highlighting
    setNewlyCreatedDisputes(prev => new Set([...prev, newDispute.id]));
    
    // Remove from newly created after 3 seconds
    setTimeout(() => {
      setNewlyCreatedDisputes(prev => {
        const updated = new Set(prev);
        updated.delete(newDispute.id);
        return updated;
      });
    }, 3000);
    
    setIsCreateModalOpen(false);
  };

  const handleViewDispute = (dispute: Dispute) => {
    setSelectedDispute(dispute);
    setView('details');
  };

  return (
    <div className="space-y-6">
      {/* Update Indicator */}
      <UpdateIndicator />
      
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
            <TableSkeleton />
          ) : (
            <DisputeList disputes={disputes} onViewDispute={handleViewDispute} newlyCreatedDisputes={newlyCreatedDisputes} />
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
        onSuccess={() => {fetchDisputes(true) ; setIsCreateModalOpen(false)}}
      />
    </div>
  );
};

export default DisputeManagement;
