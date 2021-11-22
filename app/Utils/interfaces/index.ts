export interface IUpdatedValues {
  oldest?: IUpdatedValues | object;
  lastest?: IUpdatedValues | object;
  new: IUpdatedValues | object;
}

export interface IAuditTrail {
  created_by?: string;
  created_on?: number;
  updated_by: string | null;
  updated_on: number | null;
  updated_values: IUpdatedValues | null;
}

export interface ISupportsDocuments {
  id: string;
  name: string;
  path: string;
}

interface IGeographyPosition {
  country: string;
  countryCode: number;
  state: string;
  stateCode: number;
  city: string;
  cityCode: number;
  commune?: string;
  communeCode?: number;
  neighborhood?: string;
  neighborhoodCode?: number;
}

export interface ILocation {
  address: string;
  geographyPosition: IGeographyPosition;
  cb?: number;
  cbml?: number;
}

export interface IDataToken {
  id: number;
}

export interface IDataUser {
  id: number;
  name: string;
}

export interface IResponseData {
  message: string;
  results?: any;
  error?: any;
  total?: number;
}

export * from "./detailsUser";
export * from "./user";
// export * from "./permit.interface";
