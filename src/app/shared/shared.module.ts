import { ValidatorsService } from './validators.service';
import { InputErrorFieldComponent } from './components/input-error-field/input-error-field.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { InputErrorDirective } from './directives/input-error/input-error.directive';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

@NgModule({
  declarations: [InputErrorDirective, InputErrorFieldComponent],
  entryComponents: [
    InputErrorFieldComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule
  ],
  exports: [
    InputErrorFieldComponent,
    InputErrorDirective
  ],
  providers: [
    ValidatorsService
  ]
})
export class SharedModule { }
