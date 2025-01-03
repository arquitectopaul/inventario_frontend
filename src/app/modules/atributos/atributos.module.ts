import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MaterialModule } from '../shared/material.module';
import { AtributosComponent } from './atributos/atributos.component';
import { NewAtributosComponent } from './new-atributos/new-atributos.component';

@NgModule({
  declarations: [
    AtributosComponent,
    NewAtributosComponent
  ],
  imports: [
    CommonModule,
    MaterialModule,
    FormsModule,
    ReactiveFormsModule
  ]
})
export class AtributosModule { }
