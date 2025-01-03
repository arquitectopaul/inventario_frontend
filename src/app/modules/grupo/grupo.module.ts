import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GrupoComponent } from './components/grupo/grupo.component';
import { MaterialModule } from '../shared/material.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NewGrupoComponent } from './components/new-grupo/new-grupo.component';

@NgModule({
  declarations: [
    GrupoComponent,
    NewGrupoComponent
  ],
  imports: [
    CommonModule,
    MaterialModule,
    FormsModule,
    ReactiveFormsModule
  ]
})
export class GrupoModule { }