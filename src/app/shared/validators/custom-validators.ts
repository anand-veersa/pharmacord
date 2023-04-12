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
