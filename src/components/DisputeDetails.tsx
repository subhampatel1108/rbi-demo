import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Textarea } from '@/components/ui/textarea';
import { ArrowLeft, FileText, ChevronUp, Menu, X, Check } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { Dispute } from '@/components/DisputeManagement';

interface DisputeDetailsProps {
  dispute: Dispute;
  onBack: () => void;
  activeTab?: 'raised-by-us' | 'raised-against-us';
  onActionComplete?: () => void;
}

const DisputeDetails = ({ dispute, onBack, activeTab = 'raised-by-us', onActionComplete }: DisputeDetailsProps) => {
  const { email } = useAuth();
  const { toast } = useToast();
  const [isActionModalOpen, setIsActionModalOpen] = useState(false);
  const [selectedAction, setSelectedAction] = useState<'reject' | 'resolve'>('resolve');
  const [feedback, setFeedback] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleActionClick = (action: 'reject' | 'resolve') => {
    setSelectedAction(action);
    setIsActionModalOpen(true);
  };

  const handleSendAction = async () => {
    if (!feedback.trim()) {
      toast({
        title: "Validation Error",
        description: "Please provide feedback before submitting",
        variant: "destructive"
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const requestBody = {
        decision: selectedAction,
        feedback: feedback.trim()
      };

      const response = await fetch('http://127.0.0.1:8080/update', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody)
      });

      if (response.ok) {
        toast({
          title: "Success",
          description: `Dispute ${selectedAction === 'resolve' ? 'resolved' : 'rejected'} successfully`,
          variant: "info"
        });
        
        setIsActionModalOpen(false);
        setFeedback('');
        onBack(); // Return to list view
        if (onActionComplete) {
          onActionComplete(); // Trigger force update
        }
      } else {
        const errorData = await response.json().catch(() => ({ message: 'Unknown error' }));
        toast({
          title: "Error",
          description: errorData.message || "Failed to update dispute",
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error('Error updating dispute:', error);
      toast({
        title: "Error",
        description: "Network error. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'PENDING': return 'bg-yellow-200 text-yellow-900';
      case 'RESOLVED': return 'bg-green-100 text-green-800';
      case 'REJECTED': return 'bg-red-100 text-red-800';
      case 'INFO_REQUESTED': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityIcon = (priority: string) => {
    let count = 1;
    let color = 'text-green-500';

    switch (priority) {
      case 'Low':
        count = 1;
        color = 'text-green-500';
        break;
      case 'Medium':
        count = 2;
        color = 'text-orange-500';
        break;
      case 'High':
        count = 3;
        color = 'text-red-500';
        break;
      case 'Critical':
        count = 3;
        color = 'text-red-500';
        break;
      default:
        count = 1;
        color = 'text-green-500';
    }

    return (
      <div className="flex items-center space-x-2">
        <div className="flex flex-col">
          {Array.from({ length: count }, (_, index) => (
            <ChevronUp key={index} className={`h-4 w-4 ${color} stroke-[2] ${index > 0 ? '-mt-3' : ''}`} />
          ))}
        </div>
        <span className="font-medium">{priority}</span>
      </div>
    );
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const timelineEvents = [
    {
      title: "Order Created",
      time: "12 Aug, 11:39:35 PM",
      description: "Transaction Created\nGeddit initiated txns",
      status: "completed",
      color: "bg-green-500"
    },
    {
      title: "Gateway Selected",
      time: "12 Aug, 11:39:35 PM",
      description: "Pinelabs chosen as the preferred gateway based on Gateway Score: .89",
      status: "completed",
      color: "bg-green-500"
    },
    {
      title: "Payment Initiated",
      time: "12 Aug, 11:39:35 PM",
      description: "PayStart Triggered\nSub information about this step",
      status: "completed",
      color: "bg-green-500"
    },
    {
      title: "Order Status Check",
      time: "12 Aug, 11:39:35 PM",
      description: "Status Check With PG\nPG approved the transaction",
      status: "error",
      color: "bg-red-500"
    },
    {
      title: "PG Webhook Received",
      time: "12 Aug, 11:39:35 PM",
      description: "Information about this, maybe the webhook ID or event name can be added here",
      status: "completed",
      color: "bg-red-500"
    },
    {
      title: "Order Status Check",
      time: "",
      description: "",
      status: "pending",
      color: "bg-gray-300"
    }
  ];

  // Layout for "Disputes Raised Against Us"
  if (activeTab === 'raised-against-us') {
    return (
      <div className="max-w-7xl mx-auto p-6">
        {/* Header with back button and action buttons */}
        <div className="flex items-center justify-between mb-8">
          <Button 
            variant="ghost" 
            onClick={onBack} 
            className="flex items-center gap-2 bg-gray-100 hover:bg-gray-200"
          >
            <ArrowLeft className="h-6 w-6" /> Back
          </Button>
          {dispute.status !== 'RESOLVED' && (
            <div className="flex space-x-3">
              <Button variant="outline" className="flex items-center space-x-2" onClick={() => handleActionClick('reject')}>
                <X className="h-4 w-4" />
                <span>Reject</span>
              </Button>
              <Button className="flex items-center space-x-2 bg-black text-white hover:bg-gray-800" onClick={() => handleActionClick('resolve')}>
                <Check className="h-4 w-4" />
                <span>Resolve</span>
              </Button>
            </div>
          )}
        </div>

        {/* Dispute ID and Status */}
        <div className="space-y-2 mb-8">
          <h1 className="text-sm font-medium text-gray-500">Dispute ID</h1>
          <div className="flex items-center space-x-4">
            <h2 className="text-2xl font-bold text-gray-900">{dispute.disputeId}</h2>
            <div className="flex items-center gap-2">
              <Badge 
                className={`${getStatusColor(dispute.status)} text-xs font-bold`}
                noHover
              >
                {dispute.status}
              </Badge>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Description Section - First */}
            <div className="space-y-4">
              <h3 className="text-xl font-semibold text-gray-900">Description</h3>
              <p className="text-gray-900 leading-relaxed">
                On 12 May 2025, at 12:30, Rajesh S Kumar approached the bank with a pressing 
                concern. He firmly believes that he has been mistakenly added to a block list, which 
                has severely impacted his ability to access essential banking services. Rajesh 
                insists that he has maintained a good standing with the bank and has not engaged 
                in any activities that would warrant such a restriction. He is seeking immediate 
                clarification and removal from the block list to restore his banking privileges.
              </p>
            </div>

            {/* Dispute Details Section */}
            <div className="space-y-6">
              <h3 className="text-xl font-semibold text-gray-900">Dispute Details</h3>
              
              <div className="space-y-6">
                {/* Opened on */}
                <div className="flex justify-between items-center">
                  <span className="text-gray-500">Opened on</span>
                  <span className="text-gray-900 font-medium">{formatDate(dispute.createdAt)}</span>
                </div>

                {/* Criticality */}
                <div className="flex justify-between items-center">
                  <span className="text-gray-500">Criticality</span>
                  {getPriorityIcon(dispute.priority)}
                </div>

                {/* Reason */}
                <div className="flex justify-between items-center">
                  <span className="text-gray-500">Reason</span>
                  <div className="flex items-center space-x-2">
                    <span className="text-gray-900 font-medium">{dispute.reason}</span>
                  </div>
                </div>

                {/* Attachments */}
                <div className="flex justify-between items-center">
                  <span className="text-gray-500">Attachments</span>
                  <div className="flex space-x-4">
                    <Button variant="outline" size="sm" className="flex items-center space-x-2">
                      <FileText className="h-4 w-4" />
                      <span>RAJESH MK.ppt</span>
                    </Button>
                    <Button variant="outline" size="sm" className="flex items-center space-x-2">
                      <FileText className="h-4 w-4" />
                      <span>RAJESH MK.ppt</span>
                    </Button>
                  </div>
                </div>
              </div>
            </div>

            {/* Identity Details Section */}
            <div className="space-y-6">
              <h3 className="text-xl font-semibold text-gray-900">Identity Details</h3>
              
              <div className="space-y-6">
                {/* Pan Number */}
                <div className="flex justify-between items-center">
                  <span className="text-gray-500">Pan Number</span>
                  <span className="text-gray-900 font-medium font-mono">BFYXXX78R</span>
                </div>

                {/* Phone number */}
                <div className="flex justify-between items-center">
                  <span className="text-gray-500">Phone number</span>
                  <span className="text-gray-900 font-medium font-mono">98546549135</span>
                </div>

                {/* Reason */}
                <div className="flex justify-between items-center">
                  <span className="text-gray-500">Reason</span>
                  <div className="flex items-center space-x-2">
                    <span className="text-gray-900 font-medium">False Positive</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Timeline */}
          <div className="lg:col-span-1">
            <div className="space-y-6">
              {timelineEvents.map((event, index) => (
                <div key={index} className="flex space-x-4">
                  {/* Timeline dot and line */}
                  <div className="flex flex-col items-center">
                    <div className={`w-3 h-3 rounded-full ${event.color} flex-shrink-0`}></div>
                    {index < timelineEvents.length - 1 && (
                      <div className="w-px h-16 bg-gray-200 mt-2"></div>
                    )}
                  </div>
                  
                  {/* Timeline content */}
                  <div className="flex-1 pb-8">
                    <div className="flex justify-between items-start mb-1">
                      <h4 className="text-sm font-medium text-gray-900">{event.title}</h4>
                      {event.time && (
                        <span className="text-xs text-gray-500 ml-2">{event.time}</span>
                      )}
                    </div>
                    {event.description && (
                      <p className="text-xs text-gray-500 whitespace-pre-line">{event.description}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Action Modal */}
        <Dialog open={isActionModalOpen} onOpenChange={setIsActionModalOpen}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Dispute Action</DialogTitle>
            </DialogHeader>
            <div className="space-y-6 py-4">
              <RadioGroup value={selectedAction} onValueChange={(value) => setSelectedAction(value as 'reject' | 'resolve')} className="flex space-x-6">
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="reject" id="reject" />
                  <Label htmlFor="reject">Reject</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="resolve" id="resolve" />
                  <Label htmlFor="resolve">Resolve</Label>
                </div>
              </RadioGroup>
              
              <div className="space-y-2">
                <Label htmlFor="feedback">Feedback</Label>
                <Textarea
                  id="feedback"
                  value={feedback}
                  onChange={(e) => setFeedback(e.target.value)}
                  placeholder="Enter your feedback..."
                  className="w-full min-h-[100px] resize-none"
                />
              </div>
              
              <Button onClick={handleSendAction} className="w-full" disabled={isSubmitting}>
                {isSubmitting ? 'Submitting...' : 'Send'}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    );
  }

  // Original layout for "Disputes Raised By Us"
  return (
    <div className="max-w-7xl mx-auto p-6">
      {/* Header with back button and menu - full width */}
      <div className="flex items-center justify-between mb-6">
        <Button 
          variant="ghost" 
          onClick={onBack} 
          className="flex items-center gap-2 bg-gray-100 hover:bg-gray-200"
        >
          <ArrowLeft className="h-6 w-6" /> Back
        </Button>
        <Button variant="ghost" size="icon">
          <Menu className="h-6 w-6" />
        </Button>
      </div>

      {/* Dispute ID and Status - full width */}
      <div className="space-y-2 mb-8">
        <h1 className="text-sm font-medium text-gray-500">Dispute ID</h1>
        <div className="flex items-center space-x-4">
          <h2 className="text-2xl font-bold text-gray-900">{dispute.disputeId}</h2>
          <div className="flex items-center gap-2">
            <Badge 
              className={`${getStatusColor(dispute.status)} text-xs font-bold`}
              noHover
            >
              {dispute.status}
            </Badge>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column - Main Content */}
        <div className="lg:col-span-2 space-y-8">
          {/* Dispute Details Section */}
          <div className="space-y-6">
            <h3 className="text-xl font-semibold text-gray-900">Dispute Details</h3>
            
            <div className="space-y-6">
              {/* Opened on */}
              <div className="flex justify-between items-center">
                <span className="text-gray-500">Opened on</span>
                <span className="text-gray-900 font-medium">{formatDate(dispute.createdAt)}</span>
              </div>

              {/* Criticality */}
              <div className="flex justify-between items-center">
                <span className="text-gray-500">Criticality</span>
                {getPriorityIcon(dispute.priority)}
              </div>

              {/* Reason */}
              <div className="flex justify-between items-center">
                <span className="text-gray-500">Reason</span>
                <div className="flex items-center space-x-2">
                  <span className="text-gray-900 font-medium">{dispute.reason}</span>
                </div>
              </div>

              {/* Attachments */}
              <div className="flex justify-between items-center">
                <span className="text-gray-500">Attachments</span>
                <div className="flex space-x-4">
                  <Button variant="outline" size="sm" className="flex items-center space-x-2">
                    <FileText className="h-4 w-4" />
                    <span>RAJESH MK.ppt</span>
                  </Button>
                  <Button variant="outline" size="sm" className="flex items-center space-x-2">
                    <FileText className="h-4 w-4" />
                    <span>RAJESH MK.ppt</span>
                  </Button>
                </div>
              </div>

              {/* Description */}
              <div className="space-y-4">
                <h4 className="text-gray-500">Description</h4>
                <p className="text-gray-900 leading-relaxed">
                  On 12 May 2025, at 12:30, Rajesh S Kumar approached the bank with a pressing 
                  concern. He firmly believes that he has been mistakenly added to a block list, which 
                  has severely impacted his ability to access essential banking services. Rajesh 
                  insists that he has maintained a good standing with the bank and has not engaged 
                  in any activities that would warrant such a restriction. He is seeking immediate 
                  clarification and removal from the block list to restore his banking privileges.
                </p>
              </div>
            </div>
          </div>

          {/* Identity Details Section */}
          <div className="space-y-6">
            <h3 className="text-xl font-semibold text-gray-900">Identity Details</h3>
            
            <div className="space-y-6">
              {/* Pan Number */}
              <div className="flex justify-between items-center">
                <span className="text-gray-500">Pan Number</span>
                <span className="text-gray-900 font-medium font-mono">BFYXXX78R</span>
              </div>

              {/* Phone number */}
              <div className="flex justify-between items-center">
                <span className="text-gray-500">Phone number</span>
                <span className="text-gray-900 font-medium font-mono">98546549135</span>
              </div>

              {/* Reason */}
              <div className="flex justify-between items-center">
                <span className="text-gray-500">Reason</span>
                <div className="flex items-center space-x-2">
                  <span className="text-gray-900 font-medium">False Positive</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column - Timeline */}
        <div className="lg:col-span-1">
          <div className="space-y-6">
            {timelineEvents.map((event, index) => (
              <div key={index} className="flex space-x-4">
                {/* Timeline dot and line */}
                <div className="flex flex-col items-center">
                  <div className={`w-3 h-3 rounded-full ${event.color} flex-shrink-0`}></div>
                  {index < timelineEvents.length - 1 && (
                    <div className="w-px h-16 bg-gray-200 mt-2"></div>
                  )}
                </div>
                
                {/* Timeline content */}
                <div className="flex-1 pb-8">
                  <div className="flex justify-between items-start mb-1">
                    <h4 className="text-sm font-medium text-gray-900">{event.title}</h4>
                    {event.time && (
                      <span className="text-xs text-gray-500 ml-2">{event.time}</span>
                    )}
                  </div>
                  {event.description && (
                    <p className="text-xs text-gray-500 whitespace-pre-line">{event.description}</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DisputeDetails;
