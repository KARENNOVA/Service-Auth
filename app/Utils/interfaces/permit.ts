import { IAuditTrail } from ".";

export interface IUserPermit {
  id?: number;
  user_id: number;
  permit_id: number;

  status?: number;
  audit_trail: IAuditTrail;
}
