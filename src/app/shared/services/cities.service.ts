import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';

import { Observable, of, forkJoin } from 'rxjs';
import { catchError, map, mergeMap } from 'rxjs/operators';

import { City } from 'src/app/shared/models/city';
import { LinksAPIResponse, CitiesAPIResponse, PreferredCitiesIdsAPIResponse } from 'src/app/shared/models/api-responses';
import { ErrorDataResponse, CityResponse, CitiesDataResponse, PreferredCitiesIdsDataResponse, PreferredCitiesDataResponse } from 'src/app/shared/models/data-responses';

@Injectable({
  providedIn: 'root'
})
export class CitiesService {

  private baseUrl: string;

  constructor(private http: HttpClient) {
    this.baseUrl = 'http://localhost:3030/';
  }

  public getCities(query: string, offset: string = '0'): Observable<CitiesDataResponse> {
    const baseResponse: CitiesDataResponse = { 
      cities: [], 
      total: 0,
      offset: '0',
      error: '' 
    };
    let queryParams = new HttpParams();
    queryParams = queryParams.append('filter', query);
    queryParams = queryParams.append('limit', '10');
    queryParams = queryParams.append('offset', offset);
    return this.http.get<CitiesAPIResponse>(`${this.baseUrl}cities`, { params: queryParams }).pipe(
      map<CitiesAPIResponse, CitiesDataResponse>((response: CitiesAPIResponse) => {
        baseResponse.cities = response.data;
        baseResponse.total = response.total;
        baseResponse.offset = this._getOffset(response.links);
        baseResponse.error = '';
        return baseResponse;
      }),
      catchError(errorResponse => this._handleError(baseResponse, errorResponse))
    );
  }

  public getCity(id: number): Observable<CityResponse> {
    const baseResponse: CityResponse = {
      city: { geonameid: 0, name: '', country: '' },
      error: ''
    };
    return this.http.get<City>(`${this.baseUrl}cities/${id}`).pipe(
      map<City, CityResponse>((response: City) => {
        baseResponse.city = response;
        baseResponse.error = '';
        return baseResponse;
      }),
      catchError(errorResponse => this._handleError(baseResponse, errorResponse))
    );
  }

  public savePreferredCities(preferredCitiesSelection: Array<any>): Observable<ErrorDataResponse> {
    const baseResponse: ErrorDataResponse = {
      error: ''
    };
    const payload = {};
    preferredCitiesSelection.map((preferredCitySelection: any) => Object.assign(payload, { [preferredCitySelection.id]: preferredCitySelection.selected }));
    return this.http.patch<PreferredCitiesIdsAPIResponse>(`${this.baseUrl}preferences/cities`, payload).pipe(
      map<PreferredCitiesIdsAPIResponse, ErrorDataResponse>(() => baseResponse),
      catchError(errorResponse => this._handleError(baseResponse, errorResponse))
    );
  }

  public getPreferredCities(): Observable<PreferredCitiesDataResponse> {
    const preferredCitiesResponse: PreferredCitiesDataResponse = {
      cities: [],
      total: 0,
      error: ''
    };
    return this._getPreferredCitiesIds().pipe(
      mergeMap<PreferredCitiesIdsDataResponse, Observable<PreferredCitiesDataResponse>>((response: PreferredCitiesIdsDataResponse) => {
        if (response.error) {
          throw new Error(response.error);
        } else {
          if (response.citiesIds.length) {
            preferredCitiesResponse.total = response.total;
            return forkJoin(response.citiesIds.map((cityId: number) => this.getCity(cityId))).pipe(
              map((citiesResponse: Array<CityResponse>) => {
                if (citiesResponse.length) {
                  if (citiesResponse.find((item: CityResponse) => item.error)) {
                    throw new Error('Missing cities!');
                  } else {
                    preferredCitiesResponse.cities = citiesResponse.map((item: CityResponse) => item.city);
                    return preferredCitiesResponse;
                  }
                } else {
                  return preferredCitiesResponse;
                }
              })
            );
          } else {
            return of(preferredCitiesResponse);
          }
        }
      }),
      catchError(errorResponse => this._handleError(preferredCitiesResponse, errorResponse))
    );
  }

  private _getPreferredCitiesIds(): Observable<PreferredCitiesIdsDataResponse> {
    const baseResponse: PreferredCitiesIdsDataResponse = {
      citiesIds: [],
      total: 0,
      error: ''
    };
    return this.http.get<PreferredCitiesIdsAPIResponse>(`${this.baseUrl}preferences/cities`).pipe(
      map<PreferredCitiesIdsAPIResponse, PreferredCitiesIdsDataResponse>((response: PreferredCitiesIdsAPIResponse) => {
        baseResponse.citiesIds = response.data;
        baseResponse.total = response.total;
        return baseResponse;
      }),
      catchError(errorResponse => this._handleError(baseResponse, errorResponse))
    );
  }

  private _handleError(baseResponse: any, errorResponse: any): Observable<any> {
    let errorObject = {};
    if (errorResponse.name && errorResponse.name === 'Error') {
      errorObject = { error: errorResponse.message };
    } else if (errorResponse.error && errorResponse.error.message) {
      errorObject = { error: errorResponse.error.message };
    } else {
      errorObject = { error: 'unknown error'};
    }
    return of(Object.assign(baseResponse, errorObject))
  }

  private _getOffset(links: LinksAPIResponse): string {
    let offset: string = '0';
    if (links.next) {
      const offsetInfoIndex: number = links.next.indexOf('offset');
      offset = links.next.substring(offsetInfoIndex + 7);
    }
    return offset;
  }
}
