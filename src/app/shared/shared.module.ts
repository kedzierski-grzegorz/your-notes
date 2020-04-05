import { SchoolsService } from './services/schools/schools.service';
import { UserService } from './services/user/user.service';
import { UpdateModalComponent } from './components/update-modal/update-modal.component';
import { ValidatorsService } from './validators.service';
import { InputErrorFieldComponent } from './components/input-error-field/input-error-field.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { InputErrorDirective } from './directives/input-error/input-error.directive';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UpdateService } from './services/update/update.service';

@NgModule({
  declarations: [InputErrorDirective, InputErrorFieldComponent, UpdateModalComponent],
  entryComponents: [
    InputErrorFieldComponent,
    UpdateModalComponent
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
    ValidatorsService,
    UpdateService,
    UserService,
    SchoolsService
  ]
})
export class SharedModule { }
