import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
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
    title: "Disputes",
    icon: AlertTriangle,
    key: "disputes"
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
      <Sidebar collapsible="icon" className="w-24">
        <SidebarHeader className="border-b p-2">
          <div className="flex justify-center">
            <Shield className="h-16 w-16 text-blue-600" />
          </div>
        </SidebarHeader>
        
        <SidebarContent>
          <SidebarGroup>
            <SidebarGroupContent>
              <SidebarMenu>
                {navigationItems.map((item) => (
                  <SidebarMenuItem key={item.key}>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <SidebarMenuButton
                          isActive={activeModule === item.key}
                          onClick={() => onModuleChange(item.key)}
                          className="w-full justify-center"
                        >
                          <item.icon className="h-7 w-7" />
                        </SidebarMenuButton>
                      </TooltipTrigger>
                      <TooltipContent side="right">
                        {item.title}
                      </TooltipContent>
                    </Tooltip>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>

        <SidebarFooter className="border-t p-4">
          <div className="flex flex-col items-center gap-3">
            <Tooltip>
              <TooltipTrigger asChild>
                <div className="flex justify-center cursor-pointer">
                  <User className="h-6 w-6 text-gray-700" />
                </div>
              </TooltipTrigger>
              <TooltipContent side="right">
                {email}
              </TooltipContent>
            </Tooltip>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="outline" onClick={logout} size="sm" className="w-10 h-10 p-0 flex-shrink-0">
                  <LogOut className="h-6 w-6" />
                </Button>
              </TooltipTrigger>
              <TooltipContent side="right">
                Logout
              </TooltipContent>
            </Tooltip>
          </div>
        </SidebarFooter>
      </Sidebar>
    </div>
  );
};

const Dashboard = () => {
  const [activeModule, setActiveModule] = useState('disputes');

  const renderContent = () => {
    switch (activeModule) {
      case 'disputes':
        return <DisputeManagement />;
      case 'analytics':
        return <BusinessAnalytics />;
      default:
        return <DisputeManagement />;
    }
  };

  const getModuleDescription = () => {
    switch (activeModule) {
      case 'disputes':
        return 'Manage and track disputes';
      case 'analytics':
        return 'Business insights and fraud analytics';
      default:
        return 'Manage and track disputes';
    }
  };

  return (
    <SidebarProvider defaultOpen={false}>
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
          <div className="flex-1 p-6 pt-6">
            {renderContent()}
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
};

export default Dashboard;
