import { City } from './city';
import { LinksResponse } from './links-response';

export interface CitiesResponse {
  data: Array<City>;
  total: number;
  links: LinksResponse;
  filter?: string;
}