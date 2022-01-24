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
