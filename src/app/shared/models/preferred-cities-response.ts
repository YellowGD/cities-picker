import { LinksResponse } from './links-response';

export interface PreferredCitiesResponse {
  data: Array<number>;
  total: number;
  links: LinksResponse;
}