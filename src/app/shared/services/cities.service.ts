import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http'

import { Observable, of } from 'rxjs';
import { catchError, map, mergeMap } from 'rxjs/operators';

import { CityInfo } from 'src/app/shared/models/city-info';
import { CitiesResponse } from 'src/app/shared/models/cities-response';
import { PreferredCitiesResponse } from '../models/preferred-cities-response';

@Injectable({
  providedIn: 'root'
})
export class CitiesService {

  private baseUrl: string;

  constructor(private http: HttpClient) {
    this.baseUrl = 'http://localhost:3030/';
  }

  public getCities(query: string): Observable<any> {
    return this.http.get<CitiesResponse>(`${this.baseUrl}cities?filter=${query}`).pipe(
      map((response: CitiesResponse) => {
        console.log(`CitiesService / getCities / response:`, response);
        return { cities: response.data };
      }),
      catchError(response => this.handleError(response))
    );
  }

  public getCity(id: number): Observable<any> {
    return this.http.get<CityInfo>(`${this.baseUrl}cities/${id}`).pipe(
      map((response: CityInfo) => ({ city: response })),
      catchError(response => this.handleError(response))
    );
  }

  public savePreferredCities(preferredCities: Array<any>): Observable<any> {
    const body = {};
    preferredCities.map((preferredCity: any) => Object.assign(body, { [preferredCity.id]: preferredCity.selected }));
    return this.http.patch<PreferredCitiesResponse>(`${this.baseUrl}preferences/cities`, body).pipe(
      map(() => ({ ok: true })),
      catchError(response => this.handleError(response))
    );
  }

  public getPreferredCities(): Observable<any> {
    return this.http.get<PreferredCitiesResponse>(`${this.baseUrl}preferences/cities`).pipe(
      map((response: PreferredCitiesResponse) => {
        console.log(`CitiesService / getPreferredCities / response:`, response);
        // if (response.data.length) {
        //   response.data.map((preferredCityId: number) => this.getCity(preferredCityId))
        // }
        return { preferredCities: response.data };
      }),
      catchError(response => this.handleError(response))
    );
  }

  private handleError(response: any): Observable<any> {
    if (response.error && response.error.message) {
      return of({ error: response.error.message });
    } else {
      return of({ error: 'unknown error'})
    }
  }
}
