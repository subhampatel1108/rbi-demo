
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import TransactionList from '@/components/TransactionList';
import TransactionDetails from '@/components/TransactionDetails';

export interface TransactionTrailStep {
  id: string;
  step: string;
  status: 'pending' | 'completed' | 'failed';
  timestamp: string;
  description: string;
  details?: Record<string, any>;
}

export interface Transaction {
  id: string;
  status: 'pending' | 'completed' | 'failed' | 'cancelled';
  timestamp: string;
  userId: string;
  amount: number;
  currency: string;
  description: string;
  trail: TransactionTrailStep[];
  metadata: {
    psp_app?: string;
    psp_bank?: string;
    issuing_bank?: string;
    utr?: string;
    payment_method?: string;
  };
}

const TransactionManagement = () => {
  const [view, setView] = useState<'list' | 'details'>('list');
  const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null);
  const [transactions] = useState<Transaction[]>([
    {
      id: 'TXN001',
      status: 'completed',
      timestamp: '2024-01-15T10:30:00Z',
      userId: 'USER123',
      amount: 1500.00,
      currency: 'INR',
      description: 'Payment to merchant',
      trail: [
        {
          id: 'step1',
          step: 'PSP App',
          status: 'completed',
          timestamp: '2024-01-15T10:30:00Z',
          description: 'Payment initiated from mobile app',
          details: { app_version: '2.1.0', device_id: 'DEV123' }
        },
        {
          id: 'step2',
          step: 'PSP Bank',
          status: 'completed',
          timestamp: '2024-01-15T10:30:15Z',
          description: 'Payment processed by PSP bank',
          details: { bank_code: 'PSP001', processing_time: '15s' }
        },
        {
          id: 'step3',
          step: 'NPCI',
          status: 'completed',
          timestamp: '2024-01-15T10:30:30Z',
          description: 'Payment routed through NPCI',
          details: { npci_ref: 'NPCI789', routing_time: '15s' }
        },
        {
          id: 'step4',
          step: 'Issuing Bank',
          status: 'completed',
          timestamp: '2024-01-15T10:30:45Z',
          description: 'Payment completed by issuing bank',
          details: { bank_code: 'ISS001', settlement_time: '15s' }
        }
      ],
      metadata: {
        psp_app: 'PayApp',
        psp_bank: 'PSP Bank Ltd',
        issuing_bank: 'State Bank of India',
        utr: 'UTR123456789',
        payment_method: 'UPI'
      }
    },
    {
      id: 'TXN002',
      status: 'failed',
      timestamp: '2024-01-15T11:15:00Z',
      userId: 'USER456',
      amount: 750.00,
      currency: 'INR',
      description: 'Bill payment',
      trail: [
        {
          id: 'step1',
          step: 'PSP App',
          status: 'completed',
          timestamp: '2024-01-15T11:15:00Z',
          description: 'Payment initiated from mobile app',
          details: { app_version: '2.1.0', device_id: 'DEV456' }
        },
        {
          id: 'step2',
          step: 'PSP Bank',
          status: 'completed',
          timestamp: '2024-01-15T11:15:10Z',
          description: 'Payment processed by PSP bank',
          details: { bank_code: 'PSP001', processing_time: '10s' }
        },
        {
          id: 'step3',
          step: 'NPCI',
          status: 'failed',
          timestamp: '2024-01-15T11:15:20Z',
          description: 'Payment failed at NPCI - insufficient funds',
          details: { npci_ref: 'NPCI790', error_code: 'U30' }
        }
      ],
      metadata: {
        psp_app: 'PayApp',
        psp_bank: 'PSP Bank Ltd',
        payment_method: 'UPI'
      }
    }
  ]);

  const handleViewTransaction = (transaction: Transaction) => {
    setSelectedTransaction(transaction);
    setView('details');
  };

  return (
    <div className="space-y-6">
      {view === 'list' && (
        <>
          <div className="flex justify-between items-center">
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Transaction List</h3>
              <p className="text-gray-600">Monitor and track all transactions</p>
            </div>
          </div>
          <TransactionList transactions={transactions} onViewTransaction={handleViewTransaction} />
        </>
      )}

      {view === 'details' && selectedTransaction && (
        <>
          <div className="flex items-center space-x-4">
            <Button
              variant="outline"
              onClick={() => setView('list')}
              size="sm"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to List
            </Button>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Transaction Details</h3>
              <p className="text-gray-600">Complete transaction information and trail</p>
            </div>
          </div>
          <TransactionDetails transaction={selectedTransaction} />
        </>
      )}
    </div>
  );
};

export default TransactionManagement;
