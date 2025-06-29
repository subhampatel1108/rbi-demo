
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { 
  TrendingUp, 
  TrendingDown, 
  DollarSign, 
  Users, 
  AlertTriangle,
  FileText,
  Download,
  Calendar
} from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  AreaChart,
  Area
} from 'recharts';

// Sample data for charts
const monthlyRevenueData = [
  { month: 'Jan', revenue: 45000, fraudLoss: 2300 },
  { month: 'Feb', revenue: 52000, fraudLoss: 1800 },
  { month: 'Mar', revenue: 48000, fraudLoss: 2100 },
  { month: 'Apr', revenue: 61000, fraudLoss: 1500 },
  { month: 'May', revenue: 55000, fraudLoss: 1900 },
  { month: 'Jun', revenue: 67000, fraudLoss: 1200 }
];

const fraudTrendData = [
  { month: 'Jan', reports: 45, resolved: 38, disputed: 7 },
  { month: 'Feb', reports: 38, resolved: 32, disputed: 6 },
  { month: 'Mar', reports: 52, resolved: 41, disputed: 11 },
  { month: 'Apr', reports: 29, resolved: 25, disputed: 4 },
  { month: 'May', reports: 41, resolved: 35, disputed: 6 },
  { month: 'Jun', reports: 33, resolved: 28, disputed: 5 }
];

const fraudTypeData = [
  { name: 'Identity Theft', value: 35, color: '#8884d8' },
  { name: 'Payment Card Fraud', value: 28, color: '#82ca9d' },
  { name: 'Online Scams', value: 22, color: '#ffc658' },
  { name: 'Account Takeover', value: 15, color: '#ff7300' }
];

const BusinessAnalytics = () => {
  const [selectedPeriod, setSelectedPeriod] = useState('6months');

  const kpiCards = [
    {
      title: 'Total Revenue',
      value: '₹328,000',
      change: '+12.5%',
      trend: 'up',
      icon: DollarSign,
      description: 'vs last 6 months'
    },
    {
      title: 'Fraud Loss',
      value: '₹10,800',
      change: '-23.4%',
      trend: 'down',
      icon: AlertTriangle,
      description: 'vs last 6 months'
    },
    {
      title: 'Active Users',
      value: '14,250',
      change: '+8.2%',
      trend: 'up',
      icon: Users,
      description: 'vs last month'
    },
    {
      title: 'Reports Resolved',
      value: '199',
      change: '+15.7%',
      trend: 'up',
      icon: FileText,
      description: 'vs last 6 months'
    }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
     

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {kpiCards.map((kpi, index) => (
          <Card key={index}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">{kpi.title}</p>
                  <p className="text-2xl font-bold text-gray-900">{kpi.value}</p>
                </div>
                <div className="h-12 w-12 bg-blue-50 rounded-lg flex items-center justify-center">
                  <kpi.icon className="h-6 w-6 text-blue-600" />
                </div>
              </div>
              <div className="mt-4 flex items-center">
                {kpi.trend === 'up' ? (
                  <TrendingUp className="h-4 w-4 text-green-600 mr-1" />
                ) : (
                  <TrendingDown className="h-4 w-4 text-green-600 mr-1" />
                )}
                <span className="text-sm font-medium text-green-600">{kpi.change}</span>
                <span className="text-sm text-gray-600 ml-2">{kpi.description}</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Charts Section */}
      <Tabs defaultValue="revenue" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="revenue">Revenue Impact</TabsTrigger>
          <TabsTrigger value="trends">Fraud Trends</TabsTrigger>
          <TabsTrigger value="types">Fraud Types</TabsTrigger>
          <TabsTrigger value="performance">Performance</TabsTrigger>
        </TabsList>

        <TabsContent value="revenue" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Revenue vs Fraud Loss</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={monthlyRevenueData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip formatter={(value) => [`₹${value.toLocaleString()}`, '']} />
                  <Bar dataKey="revenue" fill="#3b82f6" name="Revenue" />
                  <Bar dataKey="fraudLoss" fill="#ef4444" name="Fraud Loss" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="trends" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Fraud Report Trends</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={fraudTrendData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Line type="monotone" dataKey="reports" stroke="#3b82f6" name="Total Reports" strokeWidth={2} />
                  <Line type="monotone" dataKey="resolved" stroke="#10b981" name="Resolved" strokeWidth={2} />
                  <Line type="monotone" dataKey="disputed" stroke="#f59e0b" name="Disputed" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="types" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Fraud Types Distribution</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={fraudTypeData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {fraudTypeData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Fraud Impact by Type</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {fraudTypeData.map((item, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <div
                          className="w-4 h-4 rounded-full"
                          style={{ backgroundColor: item.color }}
                        />
                        <span className="font-medium">{item.name}</span>
                      </div>
                      <div className="text-right">
                        <div className="font-semibold">{item.value} cases</div>
                        <div className="text-sm text-gray-600">
                          ₹{(item.value * 800).toLocaleString()} avg loss
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="performance" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Detection Performance</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={fraudTrendData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Area
                    type="monotone"
                    dataKey="resolved"
                    stackId="1"
                    stroke="#10b981"
                    fill="#10b981"
                    fillOpacity={0.6}
                    name="Resolved"
                  />
                  <Area
                    type="monotone"
                    dataKey="disputed"
                    stackId="1"
                    stroke="#f59e0b"
                    fill="#f59e0b"
                    fillOpacity={0.6}
                    name="Disputed"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Detection Rate</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-green-600">94.2%</div>
            <p className="text-sm text-gray-600 mt-1">
              Average fraud detection accuracy
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Resolution Time</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-blue-600">2.4 days</div>
            <p className="text-sm text-gray-600 mt-1">
              Average time to resolve cases
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Prevention Savings</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-purple-600">₹1,45,000</div>
            <p className="text-sm text-gray-600 mt-1">
              Estimated fraud prevented this quarter
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default BusinessAnalytics;
