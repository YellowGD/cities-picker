import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MultiSelectComponent } from 'src/app/shared/components/multi-select/multi-select.component';

@NgModule({
  declarations: [
    MultiSelectComponent
  ],
  imports: [
    CommonModule
  ],
  exports: [
    MultiSelectComponent
  ]
})
export class SharedModule { }
