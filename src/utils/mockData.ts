// API response interfaces
export interface ApiIdentifier {
  identifier_id: string;
  identity_type: string;
  reason: string;
}

export interface ApiDispute {
  dispute_id: string;
  raised_by_party_id: string;
  raised_against_party_id: string;
  reason: string;
  status: string;
  raised_at: string;
  priority: 'Low' | 'Medium' | 'High';
  identities: ApiIdentifier[];
  resolution_comments?: string;
}

export interface ApiResponse {
  disputes: ApiDispute[];
  total_count: number;
}

// Central Negative Registry Interface
export interface NegativeRegistryEntry {
  identifier_type: 'PAN' | 'ACCOUNT_NUMBER' | 'UPI_ID' | 'MOBILE';
  identifier_id: string;
  initial_flag_by: string;
}

// Mock mode flag
export const MOCK_MODE = true;

// Central Negative Registry - Demo data
const CENTRAL_NEGATIVE_REGISTRY: NegativeRegistryEntry[] = [
  // ICICI flagged identifiers (will be disputed by HDFC)
  { identifier_type: 'PAN', identifier_id: 'BFYXXX78R', initial_flag_by: 'icici' },
  { identifier_type: 'MOBILE', identifier_id: '98546549135', initial_flag_by: 'icici' },
  { identifier_type: 'PAN', identifier_id: 'FGHIJ9012K', initial_flag_by: 'icici' },
  { identifier_type: 'UPI_ID', identifier_id: 'test@icici', initial_flag_by: 'icici' },
  { identifier_type: 'ACCOUNT_NUMBER', identifier_id: '1234567890123', initial_flag_by: 'icici' },
  { identifier_type: 'PAN', identifier_id: 'AFYXXX78R', initial_flag_by: 'icici' },
  { identifier_type: 'MOBILE', identifier_id: '67546549135', initial_flag_by: 'icici' },
  { identifier_type: 'PAN', identifier_id: 'IOHIJ9012K', initial_flag_by: 'icici' },
  { identifier_type: 'UPI_ID', identifier_id: 'tnob@icici', initial_flag_by: 'icici' },
  { identifier_type: 'ACCOUNT_NUMBER', identifier_id: '4762567890123', initial_flag_by: 'icici' },
  { identifier_type: 'PAN', identifier_id: 'JHYXXX78R', initial_flag_by: 'icici' },
  { identifier_type: 'MOBILE', identifier_id: '98546549135', initial_flag_by: 'icici' },
  { identifier_type: 'PAN', identifier_id: 'FGHIJ9012K', initial_flag_by: 'icici' },
  { identifier_type: 'UPI_ID', identifier_id: 'test@icici', initial_flag_by: 'icici' },
  { identifier_type: 'ACCOUNT_NUMBER', identifier_id: '1234567890123', initial_flag_by: 'icici' },
  // add a few more random icici entries
  { identifier_type: 'PAN', identifier_id: 'KHYXXX78R', initial_flag_by: 'icici' },
  { identifier_type: 'MOBILE', identifier_id: '78146549135', initial_flag_by: 'icici' },
  { identifier_type: 'PAN', identifier_id: 'KLJIJ9012K', initial_flag_by: 'icici' },
  { identifier_type: 'UPI_ID', identifier_id: 'test4@icici', initial_flag_by: 'icici' },
  { identifier_type: 'ACCOUNT_NUMBER', identifier_id: '4331567890123', initial_flag_by: 'icici' },
  
  // HDFC flagged identifiers (will be disputed by ICICI)
  { identifier_type: 'PAN', identifier_id: 'HDFC1234X', initial_flag_by: 'hdfc' },
  { identifier_type: 'MOBILE', identifier_id: '87654321098', initial_flag_by: 'hdfc' },
  { identifier_type: 'UPI_ID', identifier_id: 'demo@hdfc', initial_flag_by: 'hdfc' },
  
  // Other banks for variety
  { identifier_type: 'PAN', identifier_id: 'CXYPQ1234M', initial_flag_by: 'axis' },
  { identifier_type: 'MOBILE', identifier_id: '91234567890', initial_flag_by: 'sbi' },
  { identifier_type: 'PAN', identifier_id: 'ABCDE5678F', initial_flag_by: 'kotak' },
  { identifier_type: 'PAN', identifier_id: 'LMNOP3456Q', initial_flag_by: 'sbi' },
];

// LocalStorage keys
const STORAGE_KEYS = {
  DISPUTES: 'fraud_disputes',
  NEGATIVE_REGISTRY: 'negative_registry',
  DISPUTE_COUNTER: 'dispute_counter'
};

// Initialize localStorage with demo data
const initializeLocalStorage = () => {
  if (!localStorage.getItem(STORAGE_KEYS.NEGATIVE_REGISTRY)) {
    localStorage.setItem(STORAGE_KEYS.NEGATIVE_REGISTRY, JSON.stringify(CENTRAL_NEGATIVE_REGISTRY));
  }
  
  if (!localStorage.getItem(STORAGE_KEYS.DISPUTES)) {
    localStorage.setItem(STORAGE_KEYS.DISPUTES, JSON.stringify([]));
  }
  
  if (!localStorage.getItem(STORAGE_KEYS.DISPUTE_COUNTER)) {
    localStorage.setItem(STORAGE_KEYS.DISPUTE_COUNTER, '1000000000');
  }
};

// Helper function to generate dispute ID
const generateDisputeId = (): string => {
  const counter = parseInt(localStorage.getItem(STORAGE_KEYS.DISPUTE_COUNTER) || '1000000000');
  const newCounter = counter + 1;
  localStorage.setItem(STORAGE_KEYS.DISPUTE_COUNTER, newCounter.toString());
  return newCounter.toString();
};

// Helper function to get disputes from localStorage
const getStoredDisputes = (): ApiDispute[] => {
  const disputes = localStorage.getItem(STORAGE_KEYS.DISPUTES);
  return disputes ? JSON.parse(disputes) : [];
};

// Helper function to save disputes to localStorage
const saveDisputes = (disputes: ApiDispute[]) => {
  localStorage.setItem(STORAGE_KEYS.DISPUTES, JSON.stringify(disputes));
  
  // Trigger storage event for cross-tab communication
  window.dispatchEvent(new StorageEvent('storage', {
    key: STORAGE_KEYS.DISPUTES,
    newValue: JSON.stringify(disputes),
    storageArea: localStorage
  }));
};

// Helper function to find which parties should receive the dispute
const findTargetParties = (identifiers: ApiIdentifier[]): string[] => {
  const registry: NegativeRegistryEntry[] = JSON.parse(
    localStorage.getItem(STORAGE_KEYS.NEGATIVE_REGISTRY) || '[]'
  );
  
  const targetParties = new Set<string>();
  
  identifiers.forEach(identifier => {
    const registryEntry = registry.find(entry => 
      entry.identifier_id === identifier.identifier_id && 
      entry.identifier_type === identifier.identity_type
    );
    
    if (registryEntry) {
      targetParties.add(registryEntry.initial_flag_by);
    }
  });
  
  return Array.from(targetParties);
};

// Helper function to validate if all identifiers exist in the central registry
export const validateIdentifiersInRegistry = (identifiers: ApiIdentifier[]): { isValid: boolean; missingIdentifier?: ApiIdentifier } => {
  const registry: NegativeRegistryEntry[] = JSON.parse(
    localStorage.getItem(STORAGE_KEYS.NEGATIVE_REGISTRY) || '[]'
  );
  
  for (const identifier of identifiers) {
    const registryEntry = registry.find(entry => 
      entry.identifier_id === identifier.identifier_id && 
      entry.identifier_type === identifier.identity_type
    );
    
    if (!registryEntry) {
      return { isValid: false, missingIdentifier: identifier };
    }
  }
  
  return { isValid: true };
};

// Mock API: Create Dispute
export const mockCreateDispute = (disputeData: {
  raised_by_party_id: string;
  identifier: ApiIdentifier[];
}) => {
  initializeLocalStorage();
  
  const disputes = getStoredDisputes();
  const targetParties = findTargetParties(disputeData.identifier);
  
  // Create disputes for each target party
  targetParties.forEach(targetParty => {
    const newDispute: ApiDispute = {
      dispute_id: generateDisputeId(),
      raised_by_party_id: disputeData.raised_by_party_id,
      raised_against_party_id: targetParty,
      reason: disputeData.identifier.map(id => id.reason).join(', '),
      status: 'PENDING',
      raised_at: new Date().toISOString(),
      priority: 'Medium',
      identities: disputeData.identifier
    };
    
    disputes.push(newDispute);
  });
  
  saveDisputes(disputes);
  
  return { success: true, message: 'Dispute created successfully' };
};

// Mock API: Get Disputes (Raised by us)
export const mockGetDisputes = (partyId: string): ApiResponse => {
  initializeLocalStorage();
  
  const disputes = getStoredDisputes();
  const filteredDisputes = disputes.filter(dispute => 
    dispute.raised_by_party_id === partyId
  );
  
  return {
    disputes: filteredDisputes,
    total_count: filteredDisputes.length
  };
};

// Mock API: Get Assigned Disputes (Raised against us)
export const mockGetAssignedDisputes = (partyId: string): ApiResponse => {
  initializeLocalStorage();
  
  const disputes = getStoredDisputes();
  const filteredDisputes = disputes.filter(dispute => 
    dispute.raised_against_party_id === partyId
  );
  
  return {
    disputes: filteredDisputes,
    total_count: filteredDisputes.length
  };
};

// Mock API: Update Dispute Status
export const mockUpdateDisputeStatus = (disputeId: string, updateData: {
  party_id: string;
  status: string;
  resolution_comments: string;
}) => {
  initializeLocalStorage();
  
  const disputes = getStoredDisputes();
  const disputeIndex = disputes.findIndex(dispute => dispute.dispute_id === disputeId);
  
  if (disputeIndex !== -1) {
    disputes[disputeIndex].status = updateData.status;
    disputes[disputeIndex].reason = updateData.resolution_comments;
    disputes[disputeIndex].resolution_comments = updateData.resolution_comments;
    
    saveDisputes(disputes);
    
    return { 
      success: true, 
      message: 'Dispute updated successfully',
      reason: updateData.resolution_comments
    };
  }
  
  return { success: false, message: 'Dispute not found' };
};

// Storage event listener setup for real-time updates
export const setupStorageListener = (callback: () => void) => {
  const handleStorageChange = (e: StorageEvent) => {
    if (e.key === STORAGE_KEYS.DISPUTES) {
      callback();
    }
  };
  
  window.addEventListener('storage', handleStorageChange);
  
  return () => {
    window.removeEventListener('storage', handleStorageChange);
  };
};

// Legacy function for backward compatibility (returns empty data when localStorage is empty)
export const getMockResponse = (tab: string): ApiResponse => {
  if (!MOCK_MODE) {
    return { disputes: [], total_count: 0 };
  }
  
  initializeLocalStorage();
  
  // Return empty data since we'll use the new mock API functions
  return { disputes: [], total_count: 0 };
}; 