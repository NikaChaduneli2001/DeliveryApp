import { responseType } from './response-type.enum';

export interface errorResponse {
  status: responseType;
  error: any;
}
