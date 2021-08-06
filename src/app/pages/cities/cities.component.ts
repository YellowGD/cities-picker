import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';

import { debounceTime, distinctUntilChanged, filter, switchMap } from 'rxjs/operators';

import { CityInfo } from 'src/app/shared/models/city-info';

import { CitiesService } from 'src/app/shared/services/cities.service';

@Component({
  selector: 'app-cities',
  templateUrl: './cities.component.html',
  styleUrls: ['./cities.component.scss']
})
export class CitiesComponent implements OnInit {
  public inputControl: FormControl = new FormControl();
  public filteredCities: Array<CityInfo> = [];
  public preferredCities: Array<CityInfo> = [];
  public isLoadingPreferredCities: boolean = true;

  @ViewChild('searchInput') searchInput!: ElementRef<HTMLInputElement>;

  constructor(private citiesService: CitiesService) {}

  ngOnInit(): void {
    this._getPreferredCities();

    this.inputControl.valueChanges.pipe(
      debounceTime(300),
      filter((query) => query.length >= 3),
      distinctUntilChanged(),
      switchMap((query) => this.citiesService.getCities(query))
    ).subscribe(
      response => {
        if (response.cities) {
          this.filteredCities = response.cities;
        } else if (response.error) {
          console.warn('Something went wrong searching for the city');
          console.warn('Error message:', response.error);
        }
      }
    );
    // const cityId: number = 2193733; // 2193733 = "Auckland";
    // this.citiesService.getCity(cityId).subscribe(
    //   response => {
    //     if (response.city) {
    //       console.log('City:', response.city)
    //     } else if (response.error) {
    //       console.warn(`Something went wrong looking for city with ID "${cityId}"`);
    //       console.warn('Error message:', response.error);
    //     }
    //     console.log('----------------');
    //   }
    // );
  }

  public selectPreferredCity(event: MatAutocompleteSelectedEvent): void {
    const newCity: CityInfo = event.option.value;
    this.preferredCities.push(newCity);
    this.searchInput.nativeElement.value = '';
    this.inputControl.setValue('');
    this._handlePreferredCitiesSaving(newCity, true);
  }

  public removePreferredCity(cityToRemove: CityInfo): void {
    const index = this.preferredCities.indexOf(cityToRemove);
    if (index >= 0) {
      this.preferredCities.splice(index, 1);
      this._handlePreferredCitiesSaving(cityToRemove, false);
    }
  }

  private _getPreferredCities(): void {
    this.citiesService.getPreferredCities().subscribe(
      response => {
        if (response.preferredCities) {
          this.preferredCities = response.preferredCities;
        } else if (response.error) {
          console.warn('Something went wrong getting the preferred cities');
          console.warn('Error message:', response.error);
        }
        this.isLoadingPreferredCities = false;
      }
    );
  }

  private _handlePreferredCitiesSaving(city: CityInfo, selected: boolean): void {
    this.citiesService.savePreferredCities([{ id: city.geonameid, selected }]).subscribe(
      response => {
        if (response.ok) {
          console.log('Preferred cities changes were saved!');
        } else if (response.error) {
          console.warn('Something went wrong');
          console.warn('Error message:', response.error);
        }
      }
    );
  }
}
