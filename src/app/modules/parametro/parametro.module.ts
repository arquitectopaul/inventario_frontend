import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MaterialModule } from '../shared/material.module';
import { ParametroComponent } from './parametro/parametro.component';
import { NewParametroComponent } from './new-parametro/new-parametro.component';

@NgModule({
  declarations: [
    ParametroComponent,
    NewParametroComponent
  ],
  imports: [
    CommonModule,
    MaterialModule,
    FormsModule,
    ReactiveFormsModule
  ]
})
export class ParametroModule { }
