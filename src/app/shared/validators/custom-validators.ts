import { ValidationErrors } from '@angular/forms';

export function matchPasswordsValidator(control: {
  [key: string]: any;
}): ValidationErrors | null {
  return (): ValidationErrors | null => {
    const newPassword = control['newPassword'];
    const confirmPassword = control['confirmNewPassword'];
    if (newPassword.value !== confirmPassword.value) {
      return { passwordNotMatch: true };
    }
    return null;
  };
}
export function passwordPatternValidator(control: {
  [key: string]: any;
}): ValidationErrors | null {
  return (): ValidationErrors | null => {
    const newPassword = control['newPassword'].value;
    const specialCharCheck = /[!@#$%^&*]/;
    const capitalCheck = /[A-Z]+/;
    const lengthCheck = newPassword.length > 7 && newPassword.length < 31;
    const oneNumber = /.*[0-9].*/;
    const lowerCaseCheck = /[a-z]+/;
    const patternMismatch: string[] = [];
    if (!specialCharCheck.test(newPassword))
      patternMismatch.push('specialChar');
    if (!capitalCheck.test(newPassword)) patternMismatch.push('upperCase');
    if (!lengthCheck) patternMismatch.push('lengthMismatch');
    if (!oneNumber.test(newPassword)) patternMismatch.push('number');
    if (!lowerCaseCheck.test(newPassword)) patternMismatch.push('lowerCase');
    if (newPassword.length < 8) patternMismatch.push('minLength');
    return patternMismatch.length > 0 ? { patternMismatch } : null;
  };
}
