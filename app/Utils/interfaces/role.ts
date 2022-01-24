import { IAuditTrail } from ".";
export interface IPayloadRole {
  name: string;
  permits: number[];
}

export interface IRole {
  id?: number;

  role_name: string;
  permits?: number[];

  status?: number;
  audit_trail?: IAuditTrail;
}
