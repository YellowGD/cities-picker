import { NgModule } from '@angular/core';

import { SharedModule } from 'src/app/shared/shared.module'

import { CitiesComponent } from 'src/app/pages/cities/cities.component';

@NgModule({
  declarations: [
    CitiesComponent
  ],
  imports: [
    SharedModule
  ],
  exports: [
    CitiesComponent
  ]
})
export class PagesModule { }
