import { ComponentFixture, inject, TestBed } from '@angular/core/testing';
import { MatAutocompleteModule, MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { MatSnackBar } from '@angular/material/snack-bar';

import { of } from 'rxjs';

import { MessagesConstants } from 'src/app/shared/constants/messages-constants';

import { City } from 'src/app/shared/models/city';
import { ErrorDataResponse, CitiesDataResponse, PreferredCitiesDataResponse } from 'src/app/shared/models/data-responses';

import { CitiesService } from 'src/app/shared/services/cities.service';

import { CitiesComponent } from './cities.component';
import { ErrorMessageComponent } from 'src/app/shared/components/error-message/error-message.component';

const preferredCitiesDataResponseWithoutError: PreferredCitiesDataResponse = {
  cities: [
    {
      geonameid: 2193733,
      name: 'Auckland',
      country: 'New Zealand',   
      subcountry: 'Auckland'
    },
    {
      geonameid: 6230919,
      name: 'Whangarei',
      country: 'New Zealand',   
      subcountry: 'Northland'
    },
    {
      geonameid: 2190324,
      name: 'Hamilton',
      country: 'New Zealand',   
      subcountry: 'Waikato'
    }
  ],
  total: 3,
  error: ''
};

const preferredCitiesDataResponseWithError: PreferredCitiesDataResponse = {
  cities: [],
  total: 0,
  error: 'Unknown error'
};

const citiesDataResponseWithoutError: CitiesDataResponse = {
  cities: [
    {
      geonameid: 5969782,
      name: 'Hamilton',
      country: 'Canada',   
      subcountry: 'Ontario'
    },
    {
      geonameid: 2190324,
      name: 'Hamilton',
      country: 'New Zealand',   
      subcountry: 'Waikato'
    }
  ],
  total: 2,
  offset: '0',
  error: ''
};

const citiesDataResponseWithError: CitiesDataResponse = {
  cities: [],
  total: 0,
  offset: '0',
  error: 'Unknown error'
};

const errorDataResponseWithoutError: ErrorDataResponse = {
  error: ''
};

const errorDataResponseWithError: ErrorDataResponse = {
  error: 'Unknown error'
};

class MockCitiesService {
  getCities = () => of(citiesDataResponseWithoutError);
  getPreferredCities = () => of(preferredCitiesDataResponseWithoutError);
  savePreferredCities = () => of(errorDataResponseWithoutError);
}

class MockMatSnackBar {
  openFromComponent = () => null; 
}

describe('CitiesComponent', () => {
  let component: CitiesComponent;
  let fixture: ComponentFixture<CitiesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CitiesComponent ],
      imports: [
        MatAutocompleteModule
      ],
      providers: [
        { provide: CitiesService, useClass: MockCitiesService },
        { provide: MatSnackBar, useClass: MockMatSnackBar }
      ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CitiesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call "_getPreferredCities" and "_subscribeInputChanges" when "ngOnInit" is called', () => {
    // Arrrange
    spyOn<any>(component, '_getPreferredCities');
    spyOn<any>(component, '_subscribeInputChanges');
    // Act
    component.ngOnInit();
    // Assert
    expect(component['_getPreferredCities']).toHaveBeenCalled();
    expect(component['_subscribeInputChanges']).toHaveBeenCalled();
  });

  it('should add the selected preferred city to the list and call "_savePreferredCitySelection" and "_cleanInput" when "addPreferredCity" is called', () => {
    // Arrange
    const newCity: City = preferredCitiesDataResponseWithoutError.cities[0];
    const event: MatAutocompleteSelectedEvent = {
      option: {
        value: newCity
      }
    } as MatAutocompleteSelectedEvent;
    spyOn<any>(component, '_savePreferredCitySelection');
    spyOn<any>(component, '_cleanInput');
    component.preferredCities = [];
    // Act
    component.addPreferredCity(event);
    // Assert
    expect(component.preferredCities).toContain(newCity);
    expect(component['_savePreferredCitySelection']).toHaveBeenCalledWith(newCity.geonameid, true);
    expect(component['_cleanInput']).toHaveBeenCalled();
  });

  it('should remove the selected preferred city from the list and call "_savePreferredCitySelection" when "removePreferredCity" is called', () => {
    // Arrange
    const newCity: City = preferredCitiesDataResponseWithoutError.cities[0];
    spyOn<any>(component, '_savePreferredCitySelection');
    component.preferredCities = [newCity];
    // Act
    component.removePreferredCity(newCity);
    // Assert
    expect(component.preferredCities).toEqual([]);
    expect(component['_savePreferredCitySelection']).toHaveBeenCalledWith(newCity.geonameid, false);
  });

  it('should call "getCities" from service and then call "_handleCitiesResponse" when "viewMore" is called', inject([CitiesService], (citiesService: CitiesService) => {
    // Arrrange
    spyOn(citiesService, 'getCities').and.callThrough();
    spyOn<any>(component, '_handleCitiesResponse');
    component.isSearchingCities = false;
    component['lastQuery'] = 'auck';
    component['citiesOffset'] = '0';
    // Act
    component.viewMore();
    // Assert
    expect(component.isSearchingCities).toBeTrue;
    expect(citiesService.getCities).toHaveBeenCalledWith('auck', '0');
    expect(component['_handleCitiesResponse']).toHaveBeenCalled();
  }));

  it('should get the preferred cities when "_getPreferredCities" is called', inject([CitiesService], (citiesService: CitiesService) => {
    // Arrange
    spyOn(citiesService, 'getPreferredCities').and.callThrough();
    component.preferredCities = [];
    component.totalPreferredCities = 0;
    component.isLoadingPreferredCities = true;
    // Act
    component['_getPreferredCities']();
    // Assert
    expect(citiesService.getPreferredCities).toHaveBeenCalled();
    expect(component.preferredCities).toContain(preferredCitiesDataResponseWithoutError.cities[0]);
    expect(component.totalPreferredCities).toEqual(3);
    expect(component.isLoadingPreferredCities).toBeFalse();
  }));

  it('should call "_openErrorMessage" when getting the preferred cities fails when "_getPreferredCities" is called', inject([CitiesService, MatSnackBar], (citiesService: CitiesService, snackBar: MatSnackBar) => {
    // Arrange
    citiesService.getPreferredCities = () => of(preferredCitiesDataResponseWithError);
    spyOn(citiesService, 'getPreferredCities').and.callThrough();
    spyOn<any>(component, '_openErrorMessage')
    component.preferredCities = [];
    component.totalPreferredCities = 0;
    component.isLoadingPreferredCities = true;
    // Act
    component.ngOnInit();
    // Assert
    expect(citiesService.getPreferredCities).toHaveBeenCalled();
    expect(component['_openErrorMessage']).toHaveBeenCalledWith(
      MessagesConstants.EXPLANATION_GETTING,
      'Unknown error',
      MessagesConstants.RECOMMENDATION_REFRESH
    );
    expect(component.preferredCities).toEqual([]);
    expect(component.totalPreferredCities).toEqual(0);
    expect(component.isLoadingPreferredCities).toBeFalse();
  }));

  it('should update "filteredCities" when "_handleCitiesResponse" is called', () => {
    // Arrrange
    component.filteredCities = [citiesDataResponseWithoutError.cities[0]];
    component.totalFoundCities = 1;
    component['citiesOffset'] = '0';
    component.isSearchingCities = true;
    // Act
    component['_handleCitiesResponse'](citiesDataResponseWithoutError);
    // Assert
    expect(component.filteredCities).toContain(citiesDataResponseWithoutError.cities[1]);
    expect(component.totalFoundCities).toEqual(2);
    expect(component['citiesOffset']).toEqual('0');
    expect(component.isSearchingCities).toBeFalse;
  });

  it('should call "_openErrorMessage" and "_cleanInput" when "_handleCitiesResponse" is called with a response with error', () => {
    // Arrrange
    spyOn<any>(component, '_openErrorMessage');
    spyOn<any>(component, '_cleanInput');
    component.isSearchingCities = true;
    // Act
    component['_handleCitiesResponse'](citiesDataResponseWithError);
    // Assert
    expect(component['_openErrorMessage']).toHaveBeenCalledWith(
      MessagesConstants.EXPLANATION_SEARCHING, 
      'Unknown error', 
      MessagesConstants.RECOMMENDATION_REPEAT
    );
    expect(component['_cleanInput']).toHaveBeenCalled();
    expect(component.isSearchingCities).toBeFalse();
  });

  it('should call "savePreferredCities" when "_savePreferredCitySelection" is called', inject([CitiesService], (citiesService: CitiesService) => {
    // Arrange
    const cityForSave: City = preferredCitiesDataResponseWithoutError.cities[0];
    spyOn(citiesService, 'savePreferredCities').and.callThrough();
    // Act
    component['_savePreferredCitySelection'](cityForSave.geonameid, true);
    // Assert
    expect(citiesService.savePreferredCities).toHaveBeenCalledWith([{ id: cityForSave.geonameid, selected: true }]);
  }));

  it('should call "savePreferredCities" and then "_openErrorMessage" when "_savePreferredCitySelection" is called and the response has error', inject([CitiesService], (citiesService: CitiesService) => {
    // Arrange
    const cityForSave: City = preferredCitiesDataResponseWithoutError.cities[0];
    citiesService.savePreferredCities = () => of(errorDataResponseWithError);
    spyOn(citiesService, 'savePreferredCities').and.callThrough();
    spyOn<any>(component, '_openErrorMessage');
    // Act
    component['_savePreferredCitySelection'](cityForSave.geonameid, true);
    // Assert
    expect(citiesService.savePreferredCities).toHaveBeenCalledWith([{ id: cityForSave.geonameid, selected: true }]);
    expect(component['_openErrorMessage']).toHaveBeenCalledWith(
      MessagesConstants.EXPLANATION_SAVING,
      'Unknown error',
      MessagesConstants.RECOMMENDATION_REFRESH
    );
  }));

  it('should clean input when "_cleanInput" is called', () => {
    // Arrrange
    component.searchInput.nativeElement.value = 'auck';
    component.inputControl.setValue('auck');
    // Act
    component['_cleanInput']();
    // Assert
    expect(component.searchInput.nativeElement.value).toEqual('');
    expect(component.inputControl.value).toEqual('');
  });

  it('should open an error message when "_openErrorMessage" is called', () => {
    // Arrange
    const snackBarConfig = {
      data: {
        info: {
          explanation: MessagesConstants.EXPLANATION_SAVING,
          message: 'Unknown error',
          recommendation: MessagesConstants.RECOMMENDATION_REFRESH
        },
        closeText: 'OK'
      },
      panelClass: 'error-messsage-color'
    };
    spyOn(component['snackBar'], 'openFromComponent');
    // Act
    component['_openErrorMessage'](
      MessagesConstants.EXPLANATION_SAVING,
      'Unknown error',
      MessagesConstants.RECOMMENDATION_REFRESH
    );
    // Assert
    expect(component['snackBar'].openFromComponent).toHaveBeenCalledWith(ErrorMessageComponent, snackBarConfig);
  });
});
