import React from 'react';
import { Switch } from '@/components/ui/switch';

interface ModifierToggleProps {
  label: string;
  description?: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
  id: string;
}

const ModifierToggle: React.FC<ModifierToggleProps> = ({ label, description, checked, onChange, id }) => (
  <div className="flex flex-col gap-1">
    <div className="flex items-center gap-2">
      <Switch checked={checked} onCheckedChange={onChange} id={id} />
      <label htmlFor={id} className="text-gray-700 text-lg select-none cursor-pointer">{label}</label>
    </div>
    {description && <div className="text-sm text-gray-500 ml-10">{description}</div>}
  </div>
);

export default ModifierToggle; 