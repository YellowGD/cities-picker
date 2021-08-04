import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SharedModule } from 'src/app/shared/shared.module'

import { CitiesComponent } from 'src/app/pages/cities/cities.component';

@NgModule({
  declarations: [
    CitiesComponent
  ],
  imports: [
    CommonModule,
    SharedModule
  ],
  exports: [
    CitiesComponent
  ]
})
export class PagesModule { }
