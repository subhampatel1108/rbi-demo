// API response interfaces
export interface ApiDispute {
  dispute_id: string;
  raised_by_party_id: string;
  raised_against_party_id: string;
  reason: string;
  status: string;
  raised_at: string;
}

export interface ApiResponse {
  disputes: ApiDispute[];
  total_count: number;
}

// Mock mode flag
export const MOCK_MODE = true;

export const getMockResponse = (tab: string): ApiResponse => {
  if (tab === 'raised-by-us') {
    return {
      "disputes": [
        {
          "dispute_id": "rep_001",
          "raised_by_party_id": "hdfc",
          "raised_against_party_id": "icici",
          "reason": "Mismatch in KYC details",
          "status": "PENDING",
          "raised_at": "2025-06-26 12:29:55.706957"
        },
        {
          "dispute_id": "rep_001",
          "raised_by_party_id": "hdfc",
          "raised_against_party_id": "axis",
          "reason": "Mismatch in KYC details",
          "status": "RESOLVED",
          "raised_at": "2025-06-26 12:29:55.706957"
        },
        {
          "dispute_id": "rep_001",
          "raised_by_party_id": "hdfc",
          "raised_against_party_id": "sbi",
          "reason": "Mismatch in KYC details",
          "status": "RESOLVED",
          "raised_at": "2025-06-26 12:29:55.706957"
        },
        {
          "dispute_id": "rep_001",
          "raised_by_party_id": "hdfc",
          "raised_against_party_id": "kotak",
          "reason": "Mismatch in KYC details",
          "status": "PENDING",
          "raised_at": "2025-06-26 12:29:55.706957"
        },
        {
          "dispute_id": "rep_002",
          "raised_by_party_id": "hdfc",
          "raised_against_party_id": "icici",
          "reason": "Multiple linked accounts detected",
          "status": "PENDING",
          "raised_at": "2025-06-26 12:29:55.706957"
        },
        {
          "dispute_id": "rep_002",
          "raised_by_party_id": "hdfc",
          "raised_against_party_id": "axis",
          "reason": "Multiple linked accounts detected",
          "status": "RESOLVED",
          "raised_at": "2025-06-26 12:29:55.706957"
        },
        {
          "dispute_id": "rep_002",
          "raised_by_party_id": "hdfc",
          "raised_against_party_id": "sbi",
          "reason": "Multiple linked accounts detected",
          "status": "RESOLVED",
          "raised_at": "2025-06-26 12:29:55.706957"
        },
        {
          "dispute_id": "rep_002",
          "raised_by_party_id": "hdfc",
          "raised_against_party_id": "kotak",
          "reason": "Multiple linked accounts detected",
          "status": "PENDING",
          "raised_at": "2025-06-26 12:29:55.706957"
        }
      ],
      "total_count": 8
    };
  } else {
    return {
      "disputes": [
        {
          "dispute_id": "report_001",
          "raised_by_party_id": "party_001",
          "raised_against_party_id": "merchant_123",
          "reason": "Suspicious transaction pattern",
          "status": "RESOLVED",
          "raised_at": "2025-06-26 10:03:43.127213"
        },
        {
          "dispute_id": "report_002",
          "raised_by_party_id": "party_002",
          "raised_against_party_id": "merchant_123",
          "reason": "Failed to deliver goods",
          "status": "PENDING",
          "raised_at": "2025-06-26 10:03:43.127213"
        }
      ],
      "total_count": 2
    };
  }
}; 