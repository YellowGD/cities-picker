import { City } from './city';

export interface SaveConfirmationDataResponse {
  error: string;
}

export interface CityDataResponse {
  city: City;
  error: string;
}

export interface CitiesDataResponse {
  cities: Array<City>;
  total: number;
  offset: string,
  error: string;
}

export interface PreferredCitiesIdsDataResponse {
  citiesIds: Array<number>;
  total: number;
  error: string;
}

export interface PreferredCitiesDataResponse {
  cities: Array<City>;
  total: number;
  error: string;
}