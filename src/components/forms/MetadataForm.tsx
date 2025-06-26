
import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Textarea } from '@/components/ui/textarea';
import { Report } from '@/components/ReportManagement';

interface MetadataFormProps {
  formData: Omit<Report, 'created_at'>;
  setFormData: (data: Omit<Report, 'created_at'>) => void;
}

export const MetadataForm = ({ formData, setFormData }: MetadataFormProps) => {
  return (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold">Transaction Metadata</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="space-y-2">
          <Label htmlFor="instrument_used">Instrument Used</Label>
          <Select value={formData.metadata.instrument_used} onValueChange={(value) => setFormData({
            ...formData,
            metadata: { ...formData.metadata, instrument_used: value }
          })}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="DEC">DEC</SelectItem>
              <SelectItem value="CARD">Card</SelectItem>
              <SelectItem value="UPI">UPI</SelectItem>
              <SelectItem value="NEFT">NEFT</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label htmlFor="payment_system_category">Payment System Category</Label>
          <Select value={formData.metadata.payment_system_category} onValueChange={(value) => setFormData({
            ...formData,
            metadata: { ...formData.metadata, payment_system_category: value }
          })}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="CAN">CAN</SelectItem>
              <SelectItem value="VISA">VISA</SelectItem>
              <SelectItem value="MASTER">MASTER</SelectItem>
              <SelectItem value="RUPAY">RUPAY</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label htmlFor="system_involved">System Involved</Label>
          <Select value={formData.metadata.system_involved} onValueChange={(value) => setFormData({
            ...formData,
            metadata: { ...formData.metadata, system_involved: value }
          })}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="VISA">VISA</SelectItem>
              <SelectItem value="MASTER">MASTER</SelectItem>
              <SelectItem value="RUPAY">RUPAY</SelectItem>
              <SelectItem value="UPI">UPI</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
          <Label htmlFor="nature_of_transaction">Nature of Transaction</Label>
          <Select value={formData.metadata.nature_of_transaction} onValueChange={(value) => setFormData({
            ...formData,
            metadata: { ...formData.metadata, nature_of_transaction: value }
          })}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="WBC">WBC</SelectItem>
              <SelectItem value="P2P">P2P</SelectItem>
              <SelectItem value="P2M">P2M</SelectItem>
              <SelectItem value="B2B">B2B</SelectItem>
            </SelectContent>
          </Select>
        </div>
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
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
        <div className="space-y-2">
          <Label htmlFor="amount_recovered">Amount Recovered</Label>
          <Input
            id="amount_recovered"
            type="number"
            value={formData.metadata.amount_recovered}
            onChange={(e) => setFormData({
              ...formData,
              metadata: { ...formData.metadata, amount_recovered: Number(e.target.value) }
            })}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
        <div className="space-y-2">
          <Label htmlFor="detection_date">Detection Date</Label>
          <Input
            id="detection_date"
            type="date"
            value={formData.metadata.detection_date_by_entity}
            onChange={(e) => setFormData({
              ...formData,
              metadata: { ...formData.metadata, detection_date_by_entity: e.target.value }
            })}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="space-y-2">
          <Label htmlFor="entry_date">Entry Date</Label>
          <Input
            id="entry_date"
            type="date"
            value={formData.metadata.entry_date_by_entity}
            onChange={(e) => setFormData({
              ...formData,
              metadata: { ...formData.metadata, entry_date_by_entity: e.target.value }
            })}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="report_date_by_customer">Report Date by Customer</Label>
          <Input
            id="report_date_by_customer"
            type="date"
            value={formData.metadata.report_date_by_customer}
            onChange={(e) => setFormData({
              ...formData,
              metadata: { ...formData.metadata, report_date_by_customer: e.target.value }
            })}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="time_of_occurrence">Time of Occurrence</Label>
          <Input
            id="time_of_occurrence"
            type="time"
            value={formData.metadata.time_of_occurrence}
            onChange={(e) => setFormData({
              ...formData,
              metadata: { ...formData.metadata, time_of_occurrence: e.target.value }
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

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="space-y-2">
          <Label htmlFor="beneficiary_bank">Bank</Label>
          <Input
            id="beneficiary_bank"
            value={formData.metadata.beneficiary.bank}
            onChange={(e) => setFormData({
              ...formData,
              metadata: {
                ...formData.metadata,
                beneficiary: { ...formData.metadata.beneficiary, bank: e.target.value }
              }
            })}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="beneficiary_account">Account Number</Label>
          <Input
            id="beneficiary_account"
            value={formData.metadata.beneficiary.account_number}
            onChange={(e) => setFormData({
              ...formData,
              metadata: {
                ...formData.metadata,
                beneficiary: { ...formData.metadata.beneficiary, account_number: e.target.value }
              }
            })}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="beneficiary_ifsc">IFSC</Label>
          <Input
            id="beneficiary_ifsc"
            value={formData.metadata.beneficiary.ifsc}
            onChange={(e) => setFormData({
              ...formData,
              metadata: {
                ...formData.metadata,
                beneficiary: { ...formData.metadata.beneficiary, ifsc: e.target.value }
              }
            })}
          />
        </div>
      </div>

      <h4 className="text-md font-semibold mt-6">LEA Details</h4>
      <div className="space-y-2">
        <Label htmlFor="lea_case_details">LEA Case Details</Label>
        <Textarea
          id="lea_case_details"
          value={formData.metadata.lea_case_details}
          onChange={(e) => setFormData({
            ...formData,
            metadata: { ...formData.metadata, lea_case_details: e.target.value }
          })}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="modus_operandi">Modus Operandi (comma separated)</Label>
        <Textarea
          id="modus_operandi"
          value={formData.metadata.modus_operandi.join(', ')}
          onChange={(e) => setFormData({
            ...formData,
            metadata: { 
              ...formData.metadata, 
              modus_operandi: e.target.value.split(',').map(m => m.trim()).filter(m => m)
            }
          })}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="future_steps">Future Steps</Label>
        <Textarea
          id="future_steps"
          value={formData.metadata.future_steps}
          onChange={(e) => setFormData({
            ...formData,
            metadata: { ...formData.metadata, future_steps: e.target.value }
          })}
        />
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
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
            id="attempted_fraud"
            checked={formData.metadata.attempted_fraud}
            onCheckedChange={(checked) => setFormData({
              ...formData,
              metadata: { ...formData.metadata, attempted_fraud: checked as boolean }
            })}
          />
          <Label htmlFor="attempted_fraud">Attempted Fraud</Label>
        </div>
        <div className="flex items-center space-x-2">
          <Checkbox
            id="insurance_covered"
            checked={formData.metadata.insurance_covered}
            onCheckedChange={(checked) => setFormData({
              ...formData,
              metadata: { ...formData.metadata, insurance_covered: checked as boolean }
            })}
          />
          <Label htmlFor="insurance_covered">Insurance Covered</Label>
        </div>
        <div className="flex items-center space-x-2">
          <Checkbox
            id="is_domestic"
            checked={formData.metadata.is_domestic}
            onCheckedChange={(checked) => setFormData({
              ...formData,
              metadata: { ...formData.metadata, is_domestic: checked as boolean }
            })}
          />
          <Label htmlFor="is_domestic">Is Domestic</Label>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
        <div className="flex items-center space-x-2">
          <Checkbox
            id="is_closed"
            checked={formData.metadata.is_closed}
            onCheckedChange={(checked) => setFormData({
              ...formData,
              metadata: { ...formData.metadata, is_closed: checked as boolean }
            })}
          />
          <Label htmlFor="is_closed">Is Closed</Label>
        </div>
      </div>
    </div>
  );
};
