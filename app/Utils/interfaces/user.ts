import { IAuditTrail } from ".";

export interface IUser {
  id?: number;

  id_number: string;
  password?: string | undefined;
  rol_id?: number | undefined;

  status?: number;
  audit_trail?: IAuditTrail;
}
