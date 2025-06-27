import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Shield, FileText, AlertTriangle, LogOut, User, BarChart, CreditCard, ChevronLeft, ChevronRight } from 'lucide-react';
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
  SidebarFooter,
  useSidebar
} from '@/components/ui/sidebar';
import ReportManagement from '@/components/ReportManagement';
import DisputeManagement from '@/components/DisputeManagement';
import BusinessAnalytics from '@/components/BusinessAnalytics';
import TransactionManagement from '@/components/TransactionManagement';

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
  },
  {
    title: "Transactions",
    icon: CreditCard,
    key: "transactions"
  },
  {
    title: "Business & Analytics",
    icon: BarChart,
    key: "analytics"
  }
];

const AppSidebar = ({ activeModule, onModuleChange }: {
  activeModule: string;
  onModuleChange: (module: string) => void;
}) => {
  const { email, logout } = useAuth();
  const { state, toggleSidebar } = useSidebar();

  return (
    <div className="relative">
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

        <SidebarFooter className="border-t p-3">
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center space-x-2 text-sm text-gray-700 min-w-0 flex-1">
              <User className="h-4 w-4 flex-shrink-0" />
              <span className="truncate">{email}</span>
            </div>
            <Button variant="outline" onClick={logout} size="sm" className="flex-shrink-0">
              <LogOut className="h-4 w-4" />
            </Button>
          </div>
        </SidebarFooter>
      </Sidebar>
      
      {/* Custom toggle button positioned on the sidebar border */}
      <Button
        variant="outline"
        size="sm"
        onClick={toggleSidebar}
        className={`absolute top-4 -right-4 z-10 h-8 w-8 rounded-full bg-white border border-gray-200 shadow-md hover:bg-gray-50 p-0`}
      >
        {state === "collapsed" ? (
          <ChevronRight className="h-4 w-4" />
        ) : (
          <ChevronLeft className="h-4 w-4" />
        )}
      </Button>
    </div>
  );
};

const Dashboard = () => {
  const [activeModule, setActiveModule] = useState('reports');

  const renderContent = () => {
    switch (activeModule) {
      case 'reports':
        return <ReportManagement />;
      case 'disputes':
        return <DisputeManagement />;
      case 'transactions':
        return <TransactionManagement />;
      case 'analytics':
        return <BusinessAnalytics />;
      default:
        return <ReportManagement />;
    }
  };

  const getModuleDescription = () => {
    switch (activeModule) {
      case 'reports':
        return 'Monitor and manage fraud reports';
      case 'disputes':
        return 'Manage and track disputes';
      case 'transactions':
        return 'Monitor and track all transactions';
      case 'analytics':
        return 'Business insights and fraud analytics';
      default:
        return 'Monitor and manage fraud reports';
    }
  };

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-gray-50">
        <AppSidebar 
          activeModule={activeModule}
          onModuleChange={setActiveModule}
        />
        
        <main className="flex-1 flex flex-col">
          {/* Header */}
          <header className="bg-white shadow-sm border-b px-6 py-4">
            <div className="flex items-center space-x-4">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">
                  {navigationItems.find(item => item.key === activeModule)?.title || 'Dashboard'}
                </h2>
                <p className="text-gray-600">
                  {getModuleDescription()}
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
