interface JsonFormValidators {
  min?: number;
  max?: number;
  required?: boolean;
  requiredTrue?: boolean;
  email?: boolean;
  minLength?: boolean;
  maxLength?: boolean;
  pattern?: string;
  nullValidator?: boolean;
}
export interface JsonFormControlOptions {
  label: string;
  value: any;
  for?: string;
}
export interface JsonFormControls {
  name: string;
  label: string;
  value: string | number;
  type: string;
  placeholder: string;
  options?: JsonFormControlOptions[];
  validators?: JsonFormValidators;
  minDate?: Date;
  maxDate?: Date;
  class?: string;
  extLink?: string;
  display?: boolean;
  disabled?: boolean;
}
export interface JsonFormData {
  controls: JsonFormControls[];
}
