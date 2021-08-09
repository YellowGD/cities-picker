import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { MatSnackBar } from '@angular/material/snack-bar';

import { debounceTime, distinctUntilChanged, filter, switchMap, tap } from 'rxjs/operators';

import { MessagesConstants } from 'src/app/shared/constants/messages-constants';

import { City } from 'src/app/shared/models/city';
import { ErrorDataResponse, CitiesDataResponse, PreferredCitiesDataResponse } from 'src/app/shared/models/data-responses';

import { CitiesService } from 'src/app/shared/services/cities.service';

import { ErrorMessageComponent } from 'src/app/shared/components/error-message/error-message.component';

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
  public noResults: boolean = false;
  private lastQuery: string = '';
  private citiesOffset: string = '';

  @ViewChild('searchInput') searchInput!: ElementRef<HTMLInputElement>;

  constructor(
    private citiesService: CitiesService,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this._getPreferredCities();
    this._subscribeInputChanges();
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
    this.isSearchingCities = true;
    this.citiesService.getCities(this.lastQuery, this.citiesOffset).subscribe(
      (response: CitiesDataResponse) => this._handleCitiesResponse(response, true)
    );
  }

  private _getPreferredCities(): void {
    this.citiesService.getPreferredCities().subscribe(
      (response: PreferredCitiesDataResponse) => {
        if (response.error) {
          this._openErrorMessage(MessagesConstants.EXPLANATION_GETTING, response.error, MessagesConstants.RECOMMENDATION_REFRESH);
        } else {
          this.preferredCities = response.cities;
          this.totalPreferredCities = response.total;
        }
        this.isLoadingPreferredCities = false;
      }
    );
  }

  private _subscribeInputChanges(): void {
    this.inputControl.valueChanges.pipe(
      tap(() => this.noResults = false),
      debounceTime(300),
      filter((query: string) => query.length >= 3),
      distinctUntilChanged(),
      tap((query: string) => {
        this.isSearchingCities = true;
        this.lastQuery = query;
      }),
      switchMap((query: string) => this.citiesService.getCities(query)),
    ).subscribe(
      (response: CitiesDataResponse) => this._handleCitiesResponse(response)
    );
  }

  private _handleCitiesResponse(response: CitiesDataResponse, add: boolean = false): void {
    if (response.error) {
      this._openErrorMessage(MessagesConstants.EXPLANATION_SEARCHING, response.error, MessagesConstants.RECOMMENDATION_REPEAT);
      this._cleanInput();
    } else {
      if (add) {
        this.filteredCities = [...this.filteredCities, ...response.cities];
      } else {
        this.filteredCities = response.cities;
      }
      this.totalFoundCities = response.total;
      this.citiesOffset = response.offset;
      this.noResults = response.total === 0 ? true : false;
    }
    this.isSearchingCities = false;
  }

  private _savePreferredCitySelection(id: number, selected: boolean): void {
    this.citiesService.savePreferredCities([{ id, selected }]).subscribe(
      (response: ErrorDataResponse) => {
        if (response.error) {
          this._openErrorMessage(MessagesConstants.EXPLANATION_SAVING, response.error, MessagesConstants.RECOMMENDATION_REFRESH);
        }
      }
    );
  }

  private _cleanInput(): void {
    this.searchInput.nativeElement.value = '';
    this.inputControl.setValue('');
  }

  private _openErrorMessage(explanation: string, message: string, recommendation: string): void {
    this.snackBar.openFromComponent(ErrorMessageComponent, { 
      data: {
        info: {
          explanation,
          message,
          recommendation
        },             
        closeText: 'OK'
      },
      panelClass: 'error-messsage-color'
    });
  }
}
