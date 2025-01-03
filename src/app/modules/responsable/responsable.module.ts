import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ResponsableComponent } from './components/responsable/responsable.component';
import { MaterialModule } from '../shared/material.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NewResponsableComponent } from './components/new-responsable/new-responsable.component';

@NgModule({
  declarations: [
    ResponsableComponent,
    NewResponsableComponent
  ],
  imports: [
    CommonModule,
    MaterialModule,
    FormsModule,
    ReactiveFormsModule
  ]
})
export class ResponsableModule { }
