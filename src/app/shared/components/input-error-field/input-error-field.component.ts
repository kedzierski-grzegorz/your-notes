import { NgControl } from '@angular/forms';
import { Component, OnInit, Input, ElementRef, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-input-error-field',
  templateUrl: './input-error-field.component.html',
  styleUrls: ['./input-error-field.component.scss'],
})
export class InputErrorFieldComponent implements OnInit, OnDestroy {

  @Input() formControl: NgControl;
  @Input() errors: any;

  errorMessage: string;

  sibiling: ElementRef;

  valueChangeSub: Subscription;

  constructor(private elementRef: ElementRef) {
  }

  ngOnInit() {
    this.elementRef.nativeElement.style.zIndex = 0;
    this.elementRef.nativeElement.style.width = window.getComputedStyle(this.sibiling.nativeElement).getPropertyValue('width');

    this.valueChangeSub = this.formControl.valueChanges.subscribe(x => {
      this.setErrorMessage();
    });

    this.setErrorMessage();
  }

  setErrorMessage() {
    if (this.formControl.errors) {
      const errorKeys = Object.keys(this.formControl.errors);
      if (errorKeys && errorKeys.length > 0 && this.errors) {
        this.errorMessage = this.errors[errorKeys[0]] ?? '';
      } else {
        this.errorMessage = '';
      }
    } else {
      this.errorMessage = '';
    }
  }

  ngOnDestroy() {
    this.valueChangeSub.unsubscribe();
  }
}
