import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { MatSnackBar } from '@angular/material/snack-bar';

import { debounceTime, distinctUntilChanged, filter, switchMap, tap } from 'rxjs/operators';

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
  public totalFoundCities: number = 0;
  public isLoadingPreferredCities: boolean = true;
  public isSearchingCities: boolean = false;

  @ViewChild('searchInput') searchInput!: ElementRef<HTMLInputElement>;

  constructor(
    private citiesService: CitiesService,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this._getPreferredCities();
    this.inputControl.valueChanges.pipe(
      debounceTime(300),
      filter((query) => query.length >= 3),
      distinctUntilChanged(),
      tap(() => this.isSearchingCities = true),
      switchMap((query) => this.citiesService.getCities(query)),
    ).subscribe(
      (response: CitiesDataResponse) => {
        if (response.error) {
          this.snackBar.open(`Something went wrong searching for the city. Error message: "${response.error}" Please repeat the search.` , 'OK');
          this._cleanInput();
        } else {
          this.filteredCities = response.cities;
          this.totalFoundCities = response.total;
        }
        this.isSearchingCities = false;
      }
    );
  }

  public addPreferredCity(event: MatAutocompleteSelectedEvent): void {
    const newCity: City = event.option.value;
    if (!this.preferredCities.find((city: City) => city.geonameid === newCity.geonameid)) {
      this.preferredCities.push(newCity);
      this._savePreferredCitySelection(newCity.geonameid, true);
    }
    this._cleanInput();
  }

  public removePreferredCity(cityToRemove: City): void {
    const index = this.preferredCities.indexOf(cityToRemove);
    if (index >= 0) {
      this.preferredCities.splice(index, 1);
      this._savePreferredCitySelection(cityToRemove.geonameid, false);
    }
  }

  public viewMore() {
    console.log('View More!');
  }

  private _getPreferredCities(): void {
    this.citiesService.getPreferredCities().subscribe(
      (response: PreferredCitiesDataResponse) => {
        if (response.error) {
          this.snackBar.open(`Something went wrong getting the preferred cities. Error message: "${response.error}" To avoid further inconvenience please refresh the page.`, 'OK');
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
          this.snackBar.open(`Something went wrong saving the preferred cities. Error message: "${response.error}" To avoid further inconvenience please refresh the page.`, 'OK');
        }
      }
    );
  }

  private _cleanInput(): void {
    this.searchInput.nativeElement.value = '';
    this.inputControl.setValue('');
  }
}
