export interface IPaginationValidated {
  search?: { key: string; value: string };
  page: number;
  pageSize: number;
}
