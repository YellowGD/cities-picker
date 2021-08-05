import { Component, OnInit } from '@angular/core';

import { CitiesService } from 'src/app/shared/services/cities.service';

@Component({
  selector: 'app-cities',
  templateUrl: './cities.component.html',
  styleUrls: ['./cities.component.scss']
})
export class CitiesComponent implements OnInit {

  constructor(
    private citiesService: CitiesService
  ) {}

  ngOnInit(): void {
    const query: string = 'manha';
    this.citiesService.getCities(query).subscribe(
      response => {
        if (response.cities) {
          console.log('Cities:', response.cities);
        } else if (response.error) {
          console.warn(`Something went wrong looking for cities based on query "${query}"`);
          console.warn('Error message:', response.error);
        }
        console.log('----------------');
      }
    );
    const cityId: number = 2193733; // 2193733 = "Auckland";
    this.citiesService.getCity(cityId).subscribe(
      response => {
        if (response.city) {
          console.log('City:', response.city)
        } else if (response.error) {
          console.warn(`Something went wrong looking for city with ID "${cityId}"`);
          console.warn('Error message:', response.error);
        }
        console.log('----------------');
      }
    );
    // 2193733 = "Auckland" / 2190324 = "Hamilton" / 6230919 = "Whangarei"
    const preferredCities = [
      { id: 2193733, selected: true },
      { id: 2190324, selected: false },
      { id: 6230919, selected: true }
    ];
    this.citiesService.savePreferredCities(preferredCities).subscribe(
      response => {
        if (response.ok) {
          console.log('Preferred Cities were saved!');
        } else if (response.error) {
          console.warn('Something went wrong saving the preferred cities');
          console.warn('Error message:', response.error);
        }
        console.log('----------------');
      }
    );
    this.citiesService.getPreferredCities().subscribe(
      response => {
        if (response.preferredCities) {
          console.log('Preferred Cities:', response.preferredCities);
        } else if (response.error) {
          console.warn('Something went wrong looking for preferred cities');
          console.warn('Error message:', response.error);
        }
        console.log('----------------');
      }
    );
  }
}
