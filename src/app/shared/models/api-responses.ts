import { City } from './city';

export interface LinksAPIResponse {
  first: string;
  next?: string;
  prev?: string;
  last: string;
}

export interface CitiesAPIResponse {
  data: Array<City>;
  total: number;
  links: LinksAPIResponse;
  filter?: string;
}

export interface PreferredCitiesIdsAPIResponse {
  data: Array<number>;
  total: number;
  links: LinksAPIResponse;
}