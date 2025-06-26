
import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Report } from '@/components/ReportManagement';

interface BasicInfoFormProps {
  formData: Omit<Report, 'created_at'>;
  setFormData: (data: Omit<Report, 'created_at'>) => void;
}

export const BasicInfoForm = ({ formData, setFormData }: BasicInfoFormProps) => {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="fraud_type">Fraud Type</Label>
          <Select value={formData.fraud_type} onValueChange={(value) => setFormData({ ...formData, fraud_type: value })}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ACH">ACH</SelectItem>
              <SelectItem value="UPI">UPI</SelectItem>
              <SelectItem value="KYC">KYC</SelectItem>
              <SelectItem value="Credit Card">Credit Card</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label htmlFor="reported_identifier_status">Reported Identifier Status</Label>
          <Select value={formData.reported_identifier_status} onValueChange={(value) => setFormData({ ...formData, reported_identifier_status: value })}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ACTIVE">Active</SelectItem>
              <SelectItem value="BLOCKED">Blocked</SelectItem>
              <SelectItem value="SUSPENDED">Suspended</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="reported_severity">Severity</Label>
        <Select value={formData.reported_severity} onValueChange={(value) => setFormData({ ...formData, reported_severity: value })}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="LOW">Low</SelectItem>
            <SelectItem value="MEDIUM">Medium</SelectItem>
            <SelectItem value="HIGH">High</SelectItem>
            <SelectItem value="CRITICAL">Critical</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="reason_to_flag">Reason to Flag</Label>
        <Textarea
          id="reason_to_flag"
          value={formData.reason_to_flag}
          onChange={(e) => setFormData({ ...formData, reason_to_flag: e.target.value })}
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="reported_at">Reported At</Label>
        <Input
          id="reported_at"
          type="datetime-local"
          value={formData.reported_at ? new Date(formData.reported_at).toISOString().slice(0, 16) : ''}
          onChange={(e) => setFormData({ ...formData, reported_at: new Date(e.target.value).toISOString() })}
          required
        />
      </div>
    </div>
  );
};
