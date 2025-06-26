
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Shield, FileText, AlertTriangle, LogOut, User } from 'lucide-react';
import ReportManagement from '@/components/ReportManagement';
import DisputeManagement from '@/components/DisputeManagement';

interface DashboardProps {
  user: { username: string } | null;
  onLogout: () => void;
}

const Dashboard = ({ user, onLogout }: DashboardProps) => {
  const [activeTab, setActiveTab] = useState('reports');

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <Shield className="h-8 w-8 text-blue-600 mr-3" />
              <h1 className="text-xl font-semibold text-gray-900">FRM Dashboard</h1>
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2 text-gray-700">
                <User className="h-4 w-4" />
                <span>{user?.username}</span>
              </div>
              <Button variant="outline" onClick={onLogout} size="sm">
                <LogOut className="h-4 w-4 mr-2" />
                Logout
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Fraud Risk Management</h2>
          <p className="text-gray-600">Monitor and manage fraud reports and disputes</p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-2 max-w-md">
            <TabsTrigger value="reports" className="flex items-center space-x-2">
              <FileText className="h-4 w-4" />
              <span>Reports</span>
            </TabsTrigger>
            <TabsTrigger value="disputes" className="flex items-center space-x-2">
              <AlertTriangle className="h-4 w-4" />
              <span>Disputes</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="reports">
            <ReportManagement />
          </TabsContent>

          <TabsContent value="disputes">
            <DisputeManagement />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default Dashboard;
