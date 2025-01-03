import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ArticuloComponent } from './components/articulo/articulo.component';
import { MaterialModule } from '../shared/material.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NewArticuloComponent } from './components/new-articulo/new-articulo.component';
import { DatePipe } from '@angular/common';

@NgModule({
  declarations: [
    ArticuloComponent,
    NewArticuloComponent
  ],
  imports: [
    CommonModule,
    MaterialModule,
    FormsModule,
    ReactiveFormsModule
  ],
  providers: [
    DatePipe, // Agrega DatePipe a la lista de proveedores
    //ActivoService //
  ]  
})
export class ArticuloModule { }