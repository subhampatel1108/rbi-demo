
import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Plus, Trash2 } from 'lucide-react';
import { Report } from '@/components/ReportManagement';

interface RulesFormProps {
  formData: Omit<Report, 'created_at'>;
  setFormData: (data: Omit<Report, 'created_at'>) => void;
}

export const RulesForm = ({ formData, setFormData }: RulesFormProps) => {
  const addRule = () => {
    setFormData({
      ...formData,
      rules: [
        ...formData.rules,
        {
          id: `RULE${String(formData.rules.length + 1).padStart(3, '0')}`,
          rule_name: '',
          rule_details: {
            expression: '',
            source: 'external-engine',
            category: 'velocity'
          },
          created_at: new Date().toISOString()
        }
      ]
    });
  };

  const removeRule = (index: number) => {
    if (formData.rules.length > 1) {
      const newRules = formData.rules.filter((_, i) => i !== index);
      setFormData({ ...formData, rules: newRules });
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">Rules</h3>
        <Button type="button" onClick={addRule} size="sm">
          <Plus className="h-4 w-4 mr-2" />
          Add Rule
        </Button>
      </div>

      {formData.rules.map((rule, index) => (
        <Card key={index}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm">Rule {index + 1}</CardTitle>
            {formData.rules.length > 1 && (
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => removeRule(index)}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            )}
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Rule ID</Label>
                <Input
                  value={rule.id}
                  onChange={(e) => {
                    const newRules = [...formData.rules];
                    newRules[index].id = e.target.value;
                    setFormData({ ...formData, rules: newRules });
                  }}
                />
              </div>
              <div className="space-y-2">
                <Label>Rule Name</Label>
                <Input
                  value={rule.rule_name}
                  onChange={(e) => {
                    const newRules = [...formData.rules];
                    newRules[index].rule_name = e.target.value;
                    setFormData({ ...formData, rules: newRules });
                  }}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label>Expression</Label>
              <Textarea
                value={rule.rule_details.expression}
                onChange={(e) => {
                  const newRules = [...formData.rules];
                  newRules[index].rule_details.expression = e.target.value;
                  setFormData({ ...formData, rules: newRules });
                }}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Source</Label>
                <Select 
                  value={rule.rule_details.source} 
                  onValueChange={(value) => {
                    const newRules = [...formData.rules];
                    newRules[index].rule_details.source = value;
                    setFormData({ ...formData, rules: newRules });
                  }}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="external-engine">External Engine</SelectItem>
                    <SelectItem value="internal-rules">Internal Rules</SelectItem>
                    <SelectItem value="ml-model">ML Model</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Category</Label>
                <Select 
                  value={rule.rule_details.category} 
                  onValueChange={(value) => {
                    const newRules = [...formData.rules];
                    newRules[index].rule_details.category = value;
                    setFormData({ ...formData, rules: newRules });
                  }}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="velocity">Velocity</SelectItem>
                    <SelectItem value="pattern">Pattern</SelectItem>
                    <SelectItem value="threshold">Threshold</SelectItem>
                    <SelectItem value="blacklist">Blacklist</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};
