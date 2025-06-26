
import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Report } from '@/components/ReportManagement';

interface MetadataFormProps {
  formData: Omit<Report, 'created_at'>;
  setFormData: (data: Omit<Report, 'created_at'>) => void;
}

export const MetadataForm = ({ formData, setFormData }: MetadataFormProps) => {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">Transaction Metadata</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="utr">UTR</Label>
          <Input
            id="utr"
            value={formData.metadata.utr}
            onChange={(e) => setFormData({
              ...formData,
              metadata: { ...formData.metadata, utr: e.target.value }
            })}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="amount_involved">Amount Involved</Label>
          <Input
            id="amount_involved"
            type="number"
            value={formData.metadata.amount_involved}
            onChange={(e) => setFormData({
              ...formData,
              metadata: { ...formData.metadata, amount_involved: Number(e.target.value) }
            })}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="payment_channel">Payment Channel</Label>
          <Select value={formData.metadata.payment_channel} onValueChange={(value) => setFormData({
            ...formData,
            metadata: { ...formData.metadata, payment_channel: value }
          })}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="UPI">UPI</SelectItem>
              <SelectItem value="NEFT">NEFT</SelectItem>
              <SelectItem value="RTGS">RTGS</SelectItem>
              <SelectItem value="IMPS">IMPS</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label htmlFor="occurrence_date">Occurrence Date</Label>
          <Input
            id="occurrence_date"
            type="date"
            value={formData.metadata.occurrence_date_by_entity}
            onChange={(e) => setFormData({
              ...formData,
              metadata: { ...formData.metadata, occurrence_date_by_entity: e.target.value }
            })}
          />
        </div>
      </div>

      <h4 className="text-md font-semibold mt-6">Beneficiary Details</h4>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="beneficiary_name">Beneficiary Name</Label>
          <Input
            id="beneficiary_name"
            value={formData.metadata.beneficiary.name}
            onChange={(e) => setFormData({
              ...formData,
              metadata: {
                ...formData.metadata,
                beneficiary: { ...formData.metadata.beneficiary, name: e.target.value }
              }
            })}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="beneficiary_upi">UPI ID</Label>
          <Input
            id="beneficiary_upi"
            value={formData.metadata.beneficiary.upi_id}
            onChange={(e) => setFormData({
              ...formData,
              metadata: {
                ...formData.metadata,
                beneficiary: { ...formData.metadata.beneficiary, upi_id: e.target.value }
              }
            })}
          />
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex items-center space-x-2">
          <Checkbox
            id="reported_by_customer"
            checked={formData.metadata.reported_by_customer}
            onCheckedChange={(checked) => setFormData({
              ...formData,
              metadata: { ...formData.metadata, reported_by_customer: checked as boolean }
            })}
          />
          <Label htmlFor="reported_by_customer">Reported by Customer</Label>
        </div>
        <div className="flex items-center space-x-2">
          <Checkbox
            id="registered_with_lea"
            checked={formData.metadata.registered_with_lea}
            onCheckedChange={(checked) => setFormData({
              ...formData,
              metadata: { ...formData.metadata, registered_with_lea: checked as boolean }
            })}
          />
          <Label htmlFor="registered_with_lea">Registered with LEA</Label>
        </div>
      </div>
    </div>
  );
};
