import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { RouteConstants } from 'src/app/shared/constants/route-constants';

import { CitiesComponent } from 'src/app/pages/cities/cities.component';

const routes: Routes = [
  {
    path: RouteConstants.CITIES,
    component: CitiesComponent
  },
  {
    path: '**',
    redirectTo: RouteConstants.CITIES
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
