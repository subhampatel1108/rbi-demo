
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Shield, FileText, AlertTriangle, LogOut, User, Upload } from 'lucide-react';
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarTrigger,
  SidebarHeader,
  SidebarFooter
} from '@/components/ui/sidebar';
import ReportManagement from '@/components/ReportManagement';
import DisputeManagement from '@/components/DisputeManagement';

interface DashboardProps {
  user: { username: string } | null;
  onLogout: () => void;
}

// Navigation items
const navigationItems = [
  {
    title: "Reports",
    icon: FileText,
    key: "reports"
  },
  {
    title: "Disputes",
    icon: AlertTriangle,
    key: "disputes"
  }
];

const AppSidebar = ({ activeModule, onModuleChange, user, onLogout }: {
  activeModule: string;
  onModuleChange: (module: string) => void;
  user: { username: string } | null;
  onLogout: () => void;
}) => {
  return (
    <Sidebar>
      <SidebarHeader className="border-b p-4">
        <div className="flex items-center space-x-3">
          <Shield className="h-8 w-8 text-blue-600" />
          <div>
            <h1 className="text-lg font-semibold text-gray-900">FRM Dashboard</h1>
            <p className="text-sm text-gray-500">Fraud Risk Management</p>
          </div>
        </div>
      </SidebarHeader>
      
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Management</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {navigationItems.map((item) => (
                <SidebarMenuItem key={item.key}>
                  <SidebarMenuButton
                    isActive={activeModule === item.key}
                    onClick={() => onModuleChange(item.key)}
                  >
                    <item.icon className="h-4 w-4" />
                    <span>{item.title}</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="border-t p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2 text-sm text-gray-700">
            <User className="h-4 w-4" />
            <span>{user?.username}</span>
          </div>
          <Button variant="outline" onClick={onLogout} size="sm">
            <LogOut className="h-4 w-4 mr-2" />
            Logout
          </Button>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
};

const Dashboard = ({ user, onLogout }: DashboardProps) => {
  const [activeModule, setActiveModule] = useState('reports');

  const renderContent = () => {
    switch (activeModule) {
      case 'reports':
        return <ReportManagement />;
      case 'disputes':
        return <DisputeManagement />;
      default:
        return <ReportManagement />;
    }
  };

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-gray-50">
        <AppSidebar 
          activeModule={activeModule}
          onModuleChange={setActiveModule}
          user={user}
          onLogout={onLogout}
        />
        
        <main className="flex-1 flex flex-col">
          {/* Header */}
          <header className="bg-white shadow-sm border-b px-6 py-4">
            <div className="flex items-center space-x-4">
              <SidebarTrigger />
              <div>
                <h2 className="text-2xl font-bold text-gray-900">
                  {navigationItems.find(item => item.key === activeModule)?.title || 'Dashboard'}
                </h2>
                <p className="text-gray-600">
                  {activeModule === 'reports' 
                    ? 'Monitor and manage fraud reports' 
                    : 'Manage and track disputes'
                  }
                </p>
              </div>
            </div>
          </header>

          {/* Content */}
          <div className="flex-1 p-6">
            {renderContent()}
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
};

export default Dashboard;
