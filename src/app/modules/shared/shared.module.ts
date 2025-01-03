import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SidenavComponent } from './components/sidenav/sidenav.component';
import { RouterModule } from '@angular/router';
import { MaterialModule } from './material.module';
import { HttpClientModule } from '@angular/common/http';
import { ConfirmComponent } from './components/confirm/confirm.component';
import { MatIconModule } from '@angular/material/icon';

@NgModule({
  declarations: [
    SidenavComponent,
    ConfirmComponent
  ],
  exports: [
    SidenavComponent,
    MatIconModule
  ],
  imports: [
    CommonModule,
    RouterModule,
    MaterialModule,
    HttpClientModule
  ]
})
export class SharedModule { }
