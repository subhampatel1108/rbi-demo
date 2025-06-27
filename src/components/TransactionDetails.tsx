
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, XCircle, Clock, AlertCircle } from 'lucide-react';
import { Transaction } from '@/components/TransactionManagement';

interface TransactionDetailsProps {
  transaction: Transaction;
}

const TransactionDetails = ({ transaction }: TransactionDetailsProps) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'failed':
        return 'bg-red-100 text-red-800';
      case 'cancelled':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStepIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="h-5 w-5 text-green-600" />;
      case 'pending':
        return <Clock className="h-5 w-5 text-yellow-600" />;
      case 'failed':
        return <XCircle className="h-5 w-5 text-red-600" />;
      default:
        return <AlertCircle className="h-5 w-5 text-gray-600" />;
    }
  };

  const formatTimestamp = (timestamp: string) => {
    return new Date(timestamp).toLocaleString();
  };

  const formatAmount = (amount: number, currency: string) => {
    return `${currency} ${amount.toLocaleString()}`;
  };

  return (
    <div className="space-y-6">
      {/* Transaction Overview */}
      <Card>
        <CardHeader>
          <CardTitle>Transaction Overview</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <label className="text-sm font-medium text-gray-500">Transaction ID</label>
              <p className="text-lg font-semibold">{transaction.id}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-500">Status</label>
              <div className="mt-1">
                <Badge className={getStatusColor(transaction.status)}>
                  {transaction.status.toUpperCase()}
                </Badge>
              </div>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-500">Amount</label>
              <p className="text-lg font-semibold">{formatAmount(transaction.amount, transaction.currency)}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-500">User ID</label>
              <p className="text-lg font-semibold">{transaction.userId}</p>
            </div>
          </div>
          <div className="mt-4">
            <label className="text-sm font-medium text-gray-500">Description</label>
            <p className="text-base">{transaction.description}</p>
          </div>
          <div className="mt-4">
            <label className="text-sm font-medium text-gray-500">Timestamp</label>
            <p className="text-base">{formatTimestamp(transaction.timestamp)}</p>
          </div>
        </CardContent>
      </Card>

      {/* Transaction Metadata */}
      <Card>
        <CardHeader>
          <CardTitle>Transaction Metadata</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            {Object.entries(transaction.metadata).map(([key, value]) => (
              <div key={key}>
                <label className="text-sm font-medium text-gray-500 capitalize">
                  {key.replace(/_/g, ' ')}
                </label>
                <p className="text-base">{value}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Transaction Trail */}
      <Card>
        <CardHeader>
          <CardTitle>Transaction Trail</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {transaction.trail.map((step, index) => (
              <div key={step.id} className="flex items-start space-x-4">
                <div className="flex-shrink-0 mt-1">
                  {getStepIcon(step.status)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <h4 className="text-sm font-medium text-gray-900">{step.step}</h4>
                    <Badge className={getStatusColor(step.status)}>
                      {step.status.toUpperCase()}
                    </Badge>
                  </div>
                  <p className="text-sm text-gray-600 mt-1">{step.description}</p>
                  <p className="text-xs text-gray-500 mt-1">{formatTimestamp(step.timestamp)}</p>
                  
                  {step.details && (
                    <div className="mt-2 p-2 bg-gray-50 rounded-md">
                      <h5 className="text-xs font-medium text-gray-700 mb-1">Details</h5>
                      <div className="space-y-1">
                        {Object.entries(step.details).map(([key, value]) => (
                          <div key={key} className="flex justify-between text-xs">
                            <span className="text-gray-600 capitalize">{key.replace(/_/g, ' ')}:</span>
                            <span className="text-gray-900">{value}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
                {index < transaction.trail.length - 1 && (
                  <div className="absolute left-6 mt-8 h-8 w-px bg-gray-200" />
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default TransactionDetails;
