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
          "dispute_id": "3252357872",
          "raised_by_party_id": "hdfc",
          "raised_against_party_id": "icici",
          "reason": "Mismatch in KYC details",
          "status": "PENDING",
          "raised_at": "2025-06-26 12:29:55.706957",
          "priority": "High",
          "identities": [
            {
              "identifier_id": "BFYXXX78R",
              "identity_type": "PAN",
              "reason": "Identifier falsely marked as fraud"
            },
            {
              "identifier_id": "98546549135",
              "identity_type": "MOBILE",
              "reason": "Supporting documents missing"
            }
          ]
        },
        {
          "dispute_id": "7836451209",
          "raised_by_party_id": "hdfc",
          "raised_against_party_id": "axis",
          "reason": "Mismatch in KYC details",
          "status": "RESOLVED",
          "raised_at": "2025-06-26 12:29:55.706957",
          "priority": "Medium",
          "identities": [
            {
              "identifier_id": "CXYPQ1234M",
              "identity_type": "PAN",
              "reason": "False positive detection"
            }
          ]
        },
        {
          "dispute_id": "9087123456",
          "raised_by_party_id": "hdfc",
          "raised_against_party_id": "sbi",
          "reason": "Mismatch in KYC details",
          "status": "REJECTED",
          "raised_at": "2025-06-26 12:29:55.706957",
          "priority": "Low",
          "identities": [
            {
              "identifier_id": "91234567890",
              "identity_type": "MOBILE",
              "reason": "Fraudulent activity detected"
            }
          ]
        },
        {
          "dispute_id": "5647382910",
          "raised_by_party_id": "hdfc",
          "raised_against_party_id": "kotak",
          "reason": "Mismatch in KYC details",
          "status": "INFO_REQUESTED",
          "raised_at": "2025-06-26 12:29:55.706957",
          "priority": "High",
          "identities": [
            {
              "identifier_id": "ABCDE5678F",
              "identity_type": "PAN", 
              "reason": "Identity verification failed"
            },
            {
              "identifier_id": "user@email.com",
              "identity_type": "EMAIL",
              "reason": "Email address flagged"
            }
          ]
        },
        {
          "dispute_id": "2198765432",
          "raised_by_party_id": "hdfc",
          "raised_against_party_id": "icici",
          "reason": "Multiple linked accounts detected",
          "status": "PENDING",
          "raised_at": "2025-06-26 12:29:55.706957",
          "priority": "Medium",
          "identities": [
            {
              "identifier_id": "FGHIJ9012K",
              "identity_type": "PAN",
              "reason": "Linked to multiple accounts"
            }
          ]
        },
        {
          "dispute_id": "6543217890",
          "raised_by_party_id": "hdfc",
          "raised_against_party_id": "axis",
          "reason": "Multiple linked accounts detected",
          "status": "RESOLVED",
          "raised_at": "2025-06-26 12:29:55.706957",
          "priority": "Low",
          "identities": [
            {
              "identifier_id": "87654321098",
              "identity_type": "MOBILE",
              "reason": "Account linking issue"
            }
          ]
        },
        {
          "dispute_id": "8901234567",
          "raised_by_party_id": "hdfc",
          "raised_against_party_id": "sbi",
          "reason": "Multiple linked accounts detected",
          "status": "INFO_REQUESTED",
          "raised_at": "2025-06-26 12:29:55.706957",
          "priority": "Medium",
          "identities": [
            {
              "identifier_id": "LMNOP3456Q",
              "identity_type": "PAN",
              "reason": "Duplicate account creation"
            }
          ]
        },
        {
          "dispute_id": "4567890123",
          "raised_by_party_id": "hdfc",
          "raised_against_party_id": "kotak",
          "reason": "Multiple linked accounts detected",
          "status": "REJECTED",
          "raised_at": "2025-06-26 12:29:55.706957",
          "priority": "High",
          "identities": [
            {
              "identifier_id": "admin@bank.com",
              "identity_type": "EMAIL",
              "reason": "Administrative error"
            }
          ]
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
          "priority": "High",
          "identities": [
            {
              "identifier_id": "STUVW7890X",
              "identity_type": "PAN",
              "reason": "Transaction pattern anomaly"
            }
          ]
        },
        {
          "dispute_id": "9876543210",
          "raised_by_party_id": "party_002",
          "raised_against_party_id": "merchant_123",
          "reason": "Failed to deliver goods",
          "status": "INFO_REQUESTED",
          "raised_at": "2025-06-26 10:03:43.127213",
          "priority": "Medium",
          "identities": [
            {
              "identifier_id": "76543210987",
              "identity_type": "MOBILE",
              "reason": "Delivery verification issue"
            }
          ]
        }
      ],
      "total_count": 2
    };
  }
}; 