interface JsonFormValidators {
  min?: number;
  max?: number;
  required?: boolean;
  requiredTrue?: boolean;
  email?: boolean;
  pattern?: string;
  nullValidator?: boolean;
  match?: boolean;
  passwordPattern?: true;
}
export interface JsonFormControlOptions {
  label: string;
  value: any;
  for?: string;
}
export interface JsonFormControls {
  name: string;
  label: string;
  value: any;
  type: string;
  subType?: string;
  placeholder: string;
  options?: JsonFormControlOptions[];
  validators?: JsonFormValidators;
  for?: string;
  minDate?: Date;
  maxDate?: Date;
  class?: string;
  extLink?: string;
  display?: boolean;
  disabled?: boolean;
  preventDefaultSelection?: boolean;
}
export interface JsonFormData {
  controls: JsonFormControls[];
}
