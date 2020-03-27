import { InputErrorFieldComponent } from './../../components/input-error-field/input-error-field.component';
import { Directive, Self, ElementRef, ViewContainerRef, ComponentFactoryResolver, OnInit, Renderer2, Input } from '@angular/core';
import { NgControl } from '@angular/forms';

@Directive({
  selector: '[appInputError], [appInputErrorMessages]'
})
export class InputErrorDirective implements OnInit {

  @Input('appInputError') control: NgControl;
  @Input('appInputErrorMessages') errors: any;

  constructor(
    private viewContainerRef: ViewContainerRef,
    private componentFactoryResolver: ComponentFactoryResolver,
    private element: ElementRef
  ) { }

  ngOnInit() {
    this.createErrorComponent();
  }

  createErrorComponent() {
    const componentFactory = this.componentFactoryResolver.resolveComponentFactory(InputErrorFieldComponent);
    const componentRef = this.viewContainerRef.createComponent(componentFactory);
    componentRef.instance.formControl = this.control;
    componentRef.instance.sibiling = this.element;
    componentRef.instance.errors = this.errors;
  }
}
