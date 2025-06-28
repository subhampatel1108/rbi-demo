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
  const { email, emailDomain, logout } = useAuth();
  const { state, toggleSidebar } = useSidebar();

  const getSidebarColor = (domain: string) => {
    switch (domain.toLowerCase()) {
      case 'hdfc':
        return '#B9DCFF';
      case 'icici':
        return '#F8C6C7';
      default:
        return '#f1f5f9'; // Default sidebar color
    }
  };

  const getIconBackgroundColor = (domain: string) => {
    switch (domain.toLowerCase()) {
      case 'hdfc':
        return '#A0C8FF'; // Darker blue for HDFC icons
      case 'icici':
        return '#F0B0B3'; // Darker pink for ICICI icons
      default:
        return '#e2e8f0'; // Darker gray for default icons
    }
  };

  const getBankLogo = (domain: string) => {
    switch (domain.toLowerCase()) {
      case 'hdfc':
        return '/(LT) HDFC Bank.png';
      case 'icici':
        return '/(LT) ICICI Bank.png';
      default:
        return null; // Will show Shield icon as fallback
    }
  };

  const sidebarStyle = {
    backgroundColor: getSidebarColor(emailDomain)
  };

  const iconBackgroundStyle = {
    backgroundColor: getIconBackgroundColor(emailDomain)
  };

  const logoSrc = getBankLogo(emailDomain);

  return (
    <div className="relative">
      <Sidebar collapsible="icon" className="w-24" style={sidebarStyle}>
        <SidebarHeader className="border-b p-2" style={sidebarStyle}>
          <div className="flex justify-center">
            {logoSrc ? (
              <img 
                src={logoSrc} 
                alt={`${emailDomain.toUpperCase()} Bank Logo`}
                className="h-16 w-16 object-contain"
              />
            ) : (
              <Shield className="h-16 w-16 text-blue-600" />
            )}
          </div>
        </SidebarHeader>
        
        <SidebarContent style={sidebarStyle}>
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
                          style={activeModule === item.key ? iconBackgroundStyle : {}}
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

        <SidebarFooter className="border-t p-4" style={sidebarStyle}>
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
      <div className="min-h-screen flex w-full bg-white">
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
