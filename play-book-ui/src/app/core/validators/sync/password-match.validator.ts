import {AbstractControl, ValidationErrors, ValidatorFn} from '@angular/forms';

export function match(controlName: string): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const parent = control.parent;
    if (!parent) {
      return null;
    }
    const matchControl = parent.get(controlName);
    if (!matchControl) {
      return null;
    }
    return matchControl.value === control.value ? null : {passwordMismatch: true}};
  }

