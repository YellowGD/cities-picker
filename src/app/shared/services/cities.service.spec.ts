import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { City } from 'src/app/shared/models/city';
import { LinksAPIResponse, CitiesAPIResponse, PreferredCitiesIdsAPIResponse } from 'src/app/shared/models/api-responses';
import { SaveConfirmationDataResponse, CityDataResponse, CitiesDataResponse, PreferredCitiesDataResponse } from 'src/app/shared/models/data-responses';

import { CitiesService } from './cities.service';
import {  } from '../models/data-responses';

const city: City = {
  geonameid: 2190324,
  name: 'Hamilton',
  country: 'New Zealand',   
  subcountry: 'Waikato'
};

const linksAPIResponse: LinksAPIResponse = {
  first: '',
  next: '',
  prev: '',
  last: ''
};

const citiesAPIResponse: CitiesAPIResponse = {
  data: [
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
  links: linksAPIResponse,
  filter: 'hamil'
};

const preferredCitiesIdsAPIResponse: PreferredCitiesIdsAPIResponse = {
  data: [5969782, 2190324],
  total: 2,
  links: linksAPIResponse
};

const saveConfirmationDataResponse: SaveConfirmationDataResponse = {
  error: ''
};

const cityDataResponse: CityDataResponse = {
  city: {
    geonameid: 2190324,
    name: 'Hamilton',
    country: 'New Zealand',   
    subcountry: 'Waikato'
  },
  error: ''
};

const citiesDataResponse: CitiesDataResponse = {
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

const preferredCitiesDataResponse: PreferredCitiesDataResponse = {
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
  error: ''
};

describe('CitiesService', () => {
  let service: CitiesService;
  let httpTestingController: HttpTestingController;
  const baseUrl: string = 'http://localhost:3030/';

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ HttpClientTestingModule ]
    });
    service = TestBed.inject(CitiesService);
    httpTestingController = TestBed.inject(HttpTestingController);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should make a GET http request to "cities" when "getCities" is called', () => {
    service.getCities('hamil', '10').subscribe(
      (response) => expect(response).toEqual(citiesDataResponse)
    );
    const req = httpTestingController.expectOne(`${baseUrl}cities?filter=hamil&limit=10&offset=10`);
    expect(req.request.method).toEqual('GET');
    req.flush(citiesAPIResponse);
    httpTestingController.verify();
  });

  it('should make a GET http request to "city" when "getCity" is called', () => {
    service.getCity(2190324).subscribe(
      (response) => expect(response).toEqual(cityDataResponse)
    );
    const req = httpTestingController.expectOne(`${baseUrl}cities/2190324`);
    expect(req.request.method).toEqual('GET');
    req.flush(city);
    httpTestingController.verify();
  });

  it('should make a PATCH http request to "preferences/cities" when "savePreferredCities" is called', () => {
    service.savePreferredCities([{ id: 2190324, selected: true }]).subscribe(
      (response) => expect(response).toEqual(saveConfirmationDataResponse)
    );
    const req = httpTestingController.expectOne(`${baseUrl}preferences/cities`);
    expect(req.request.method).toEqual('PATCH');
    req.flush(preferredCitiesIdsAPIResponse);
    httpTestingController.verify();
  });

  it('should make a GET http request to "preferences/cities" when "getPreferredCities" is called', () => {
    service.getPreferredCities().subscribe(
      (response) => expect(response).toEqual(preferredCitiesDataResponse)
    );
    const req = httpTestingController.expectOne(`${baseUrl}preferences/cities`);
    expect(req.request.method).toEqual('GET');
    req.flush(preferredCitiesIdsAPIResponse);
  });

  it('should extend "baseResponse" with the appropriate error message using "errorResponse" when "_handleError" is called', () => {
    // Arrange
    const baseResponse: CityDataResponse = {
      city: { geonameid: 0, name: '', country: '' },
      error: ''
    };
    const errorResponse: any = {
      error: {
        message: 'There is a glitch in the Matrix!'
      }
    };
    const result: CityDataResponse = {
      city: { geonameid: 0, name: '', country: '' },
      error: 'There is a glitch in the Matrix!'
    }
    // Act
    const returnValue = service['_handleError'](baseResponse, errorResponse);
    // Assert
    returnValue.subscribe(
      (response) => expect(response).toEqual(result)
    );
  });

  it('should get the offset valud from links when "_getOffset" is called', () => {
    // Arrange
    const links = {
      first: `${baseUrl}cities?filter=pla&limit=10`,
      next: `${baseUrl}cities?filter=pla&limit=10&offset=10`,
      last: `${baseUrl}cities?filter=pla&limit=10&offset=70`,
    };
    // Act
    const returnValue = service['_getOffset'](links);
    // Assert
    expect(returnValue).toEqual('10');
  });
});
