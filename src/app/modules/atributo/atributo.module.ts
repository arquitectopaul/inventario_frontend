import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MaterialModule } from '../shared/material.module';
import { AtributoComponent } from './atributo/atributo.component';
import { NewAtributoComponent } from './new-atributo/new-atributo.component';

@NgModule({
  declarations: [
    AtributoComponent,
    NewAtributoComponent
  ],
  imports: [
    CommonModule,
    MaterialModule,
    FormsModule,
    ReactiveFormsModule
  ]
})
export class AtributoModule { }
