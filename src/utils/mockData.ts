// API response interfaces
export interface ApiDispute {
  dispute_id: string;
  raised_by_party_id: string;
  raised_against_party_id: string;
  reason: string;
  status: string;
  raised_at: string;
  priority: 'Low' | 'Medium' | 'High';
}

export interface ApiResponse {
  disputes: ApiDispute[];
  total_count: number;
}

// Mock mode flag
export const MOCK_MODE = false;

export const getMockResponse = (tab: string): ApiResponse => {
  if (tab === 'raised-by-us') {
    return {
      "disputes": [
        {
          "dispute_id": "3252357872",
          "raised_by_party_id": "hdfc",
          "raised_against_party_id": "icici",
          "reason": "Mismatch in KYC details",
          "status": "PENDING",
          "raised_at": "2025-06-26 12:29:55.706957",
          "priority": "High"
        },
        {
          "dispute_id": "7836451209",
          "raised_by_party_id": "hdfc",
          "raised_against_party_id": "axis",
          "reason": "Mismatch in KYC details",
          "status": "RESOLVED",
          "raised_at": "2025-06-26 12:29:55.706957",
          "priority": "Medium"
        },
        {
          "dispute_id": "9087123456",
          "raised_by_party_id": "hdfc",
          "raised_against_party_id": "sbi",
          "reason": "Mismatch in KYC details",
          "status": "REJECTED",
          "raised_at": "2025-06-26 12:29:55.706957",
          "priority": "Low"
        },
        {
          "dispute_id": "5647382910",
          "raised_by_party_id": "hdfc",
          "raised_against_party_id": "kotak",
          "reason": "Mismatch in KYC details",
          "status": "INFO_REQUESTED",
          "raised_at": "2025-06-26 12:29:55.706957",
          "priority": "High"
        },
        {
          "dispute_id": "2198765432",
          "raised_by_party_id": "hdfc",
          "raised_against_party_id": "icici",
          "reason": "Multiple linked accounts detected",
          "status": "PENDING",
          "raised_at": "2025-06-26 12:29:55.706957",
          "priority": "Medium"
        },
        {
          "dispute_id": "6543217890",
          "raised_by_party_id": "hdfc",
          "raised_against_party_id": "axis",
          "reason": "Multiple linked accounts detected",
          "status": "RESOLVED",
          "raised_at": "2025-06-26 12:29:55.706957",
          "priority": "Low"
        },
        {
          "dispute_id": "8901234567",
          "raised_by_party_id": "hdfc",
          "raised_against_party_id": "sbi",
          "reason": "Multiple linked accounts detected",
          "status": "INFO_REQUESTED",
          "raised_at": "2025-06-26 12:29:55.706957",
          "priority": "Medium"
        },
        {
          "dispute_id": "4567890123",
          "raised_by_party_id": "hdfc",
          "raised_against_party_id": "kotak",
          "reason": "Multiple linked accounts detected",
          "status": "REJECTED",
          "raised_at": "2025-06-26 12:29:55.706957",
          "priority": "High"
        }
      ],
      "total_count": 8
    };
  } else {
    return {
      "disputes": [
        {
          "dispute_id": "1234567890",
          "raised_by_party_id": "party_001",
          "raised_against_party_id": "merchant_123",
          "reason": "Suspicious transaction pattern",
          "status": "RESOLVED",
          "raised_at": "2025-06-26 10:03:43.127213",
          "priority": "High"
        },
        {
          "dispute_id": "9876543210",
          "raised_by_party_id": "party_002",
          "raised_against_party_id": "merchant_123",
          "reason": "Failed to deliver goods",
          "status": "INFO_REQUESTED",
          "raised_at": "2025-06-26 10:03:43.127213",
          "priority": "Medium"
        }
      ],
      "total_count": 2
    };
  }
}; 