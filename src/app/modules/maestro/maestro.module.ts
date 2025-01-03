import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatSelectModule } from '@angular/material/select';
import { MatOptionModule } from '@angular/material/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MaestroComponent } from './components/maestro/maestro.component';
import { MatCardModule } from '@angular/material/card'; // Importa MatCardModule

@NgModule({
  declarations: [
    MaestroComponent,
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatSelectModule,
    MatOptionModule,
    MatFormFieldModule,
    MatCardModule // Asegúrate de importar MatCardModule
  ]
})
export class MaestroModule { }