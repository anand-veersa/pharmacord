interface JsonFormValidators {
  min?: number;
  max?: number;
  required?: boolean;
  requiredTrue?: boolean;
  email?: boolean;
  pattern?: string;
  nullValidator?: boolean;
  match?: boolean;
}
export interface JsonFormControlOptions {
  label: string;
  value: any;
}
export interface JsonFormControls {
  name: string;
  label: string;
  value: any;
  type: string;
  placeholder: string;
  validityErrorMsg?: string;
  reqErrorMsg?: string;
  options?: JsonFormControlOptions[];
  required?: boolean;
  validators?: JsonFormValidators;
  extLink?: string;
}
export interface JsonFormData {
  controls: JsonFormControls[];
}
