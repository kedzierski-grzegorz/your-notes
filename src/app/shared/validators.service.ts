import { Injectable } from '@angular/core';
import { FormControl } from '@angular/forms';

@Injectable({
  providedIn: 'root'
})
export class ValidatorsService {

  static nickValidatorRegex = /^[A-Za-z0-9!$()_]*$/;
  static nickValidatorRegexInversePerChar = /(?![A-Za-z0-9!$()_])./;

  constructor() { }

  static emailValidator(control: FormControl) {
    // tslint:disable-next-line: max-line-length
    if (/(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])/.test(control.value) == false) {
      return { emailValidator: true };
    } else {
      return null;
    }
  }

  static nickValidator(control: FormControl) {
    const nick = control.value;

    if (/^[A-Za-z0-9!$()_]*$/.test(nick) === false) {
      return { nickValidator: true };
    } else {
      return null;
    }
  }
}
