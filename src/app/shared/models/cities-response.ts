import { CityInfo } from './city-info';
import { LinksResponse } from './links-response';

export interface CitiesResponse {
  data: Array<CityInfo>;
  total: number;
  links: LinksResponse;
  filter?: string;
}