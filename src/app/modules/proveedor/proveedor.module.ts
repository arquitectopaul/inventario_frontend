import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProveedorComponent } from './components/proveedor/proveedor.component';
import { MaterialModule } from '../shared/material.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NewProveedorComponent } from './components/new-proveedor/new-proveedor.component';

@NgModule({
  declarations: [
    ProveedorComponent,
    NewProveedorComponent
  ],
  imports: [
    CommonModule,
    MaterialModule,
    FormsModule,
    ReactiveFormsModule
  ]
})
export class ProveedorModule { }