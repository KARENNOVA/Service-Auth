import { IAuditTrail } from ".";

export interface IUser {
  id?: number;

  id_number: string;
  password?: string | undefined;
  rol_id?: number | undefined;

  status?: number;
  audit_trail?: IAuditTrail;
}

export interface IDataUserPayload {
  id_number: number;
  password?: string;
}

interface INames {
  firstName: string;
  lastName: string;
}

interface ISurnames {
  firstSurname: string;
  lastSurname: string;
}

interface IDataDetailsUserPayload {
  id_type: string;
  names: INames;
  surnames: ISurnames;
  email: string;
  location: string;
  cellphone_number: number;
  phone_number: number;
  gender: string;
}

export interface IUserPayload {
  user: IDataUserPayload;
  detailsUser: IDataDetailsUserPayload;
}
