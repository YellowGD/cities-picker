import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';

import { CitiesService } from 'src/app/shared/services/cities.service';

import { MultiSelectComponent } from 'src/app/shared/components/multi-select/multi-select.component';


@NgModule({
  declarations: [
    MultiSelectComponent
  ],
  imports: [
    CommonModule,
    HttpClientModule
  ],
  providers: [
    CitiesService
  ],
  exports: [
    MultiSelectComponent
  ]
})
export class SharedModule { }
