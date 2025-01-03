import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TipoBienComponent } from './components/tipobien/tipobien.component';
import { MaterialModule } from '../shared/material.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NewTipoBienComponent } from './components/new-tipobien/new-tipobien.component';



@NgModule({
  declarations: [
    TipoBienComponent,
    NewTipoBienComponent
  ],
  imports: [
    CommonModule,
    MaterialModule,
    FormsModule,
    ReactiveFormsModule
  ]
})
export class TipoBienModule { }
