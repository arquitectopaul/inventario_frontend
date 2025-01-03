import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MaterialModule } from '../shared/material.module';
import { EspecificacionesComponent } from './especificaciones/especificaciones.component';
import { NewEspecificacionesComponent } from './new-especificaciones/new-especificaciones.component';

@NgModule({
  declarations: [
    EspecificacionesComponent,
    NewEspecificacionesComponent
  ],
  imports: [
    CommonModule,
    MaterialModule,
    FormsModule,
    ReactiveFormsModule
  ]
})
export class EspecificacionesModule { }