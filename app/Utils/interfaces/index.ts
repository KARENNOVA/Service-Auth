export interface IResponseData {
  message: string;
  results?: any;
  status: number;
  error?: any;
  page?: number;
  count?: number;
  next_page?: number | null;
  previous_page?: number | null;
  total_results?: number;
}

export interface IDataToken {
  id: number;
  iat: number;
}

export * from "./detailsUser";
export * from "./user";
export * from "./role";
export * from "./permit";
export * from "./document";
export * from "./auditTrail";
export * from "./localization";
