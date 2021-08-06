import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';

import { debounceTime, distinctUntilChanged, filter, switchMap } from 'rxjs/operators';

import { City } from 'src/app/shared/models/city';
import { ErrorDataResponse, CitiesDataResponse, PreferredCitiesDataResponse } from 'src/app/shared/models/data-responses';

import { CitiesService } from 'src/app/shared/services/cities.service';

@Component({
  selector: 'app-cities',
  templateUrl: './cities.component.html',
  styleUrls: ['./cities.component.scss']
})
export class CitiesComponent implements OnInit {
  public inputControl: FormControl = new FormControl();
  public preferredCities: Array<City> = [];
  public filteredCities: Array<City> = [];
  public totalPreferredCities: number = 0;
  public totalFilteredCities: number = 0;
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
      (response: CitiesDataResponse) => {
        if (response.error) {
          console.warn('Something went wrong searching for the city');
          console.warn('Error message:', response.error);
        } else {
          this.filteredCities = response.cities;
          this.totalFilteredCities = response.total;
        }
      }
    );
  }

  public addPreferredCity(event: MatAutocompleteSelectedEvent): void {
    const newCity: City = event.option.value;
    if (!this.preferredCities.find((city: City) => city.geonameid === newCity.geonameid)) {
      this.preferredCities.push(newCity);
      this._savePreferredCitySelection(newCity.geonameid, true);
    }
    this.searchInput.nativeElement.value = '';
    this.inputControl.setValue('');
  }

  public removePreferredCity(cityToRemove: City): void {
    const index = this.preferredCities.indexOf(cityToRemove);
    if (index >= 0) {
      this.preferredCities.splice(index, 1);
      this._savePreferredCitySelection(cityToRemove.geonameid, false);
    }
  }

  private _getPreferredCities(): void {
    this.citiesService.getPreferredCities().subscribe(
      (response: PreferredCitiesDataResponse) => {
        if (response.error) {
          console.warn('Something went wrong getting the preferred cities');
          console.warn('Error message:', response.error);
        } else {
          this.preferredCities = response.cities;
          this.totalPreferredCities = response.total;
        }
        this.isLoadingPreferredCities = false;
      }
    );
  }

  private _savePreferredCitySelection(id: number, selected: boolean): void {
    this.citiesService.savePreferredCities([{ id, selected }]).subscribe(
      (response: ErrorDataResponse) => {
        if (response.error) {
          console.warn('Something went wrong saving the preferred cities');
          console.warn('Error message:', response.error);
        } else {
          console.log('Preferred cities changes were saved!');
        }
      }
    );
  }
}
