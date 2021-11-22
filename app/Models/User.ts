import { BaseModel, column } from "@ioc:Adonis/Lucid/Orm";
import { IAuditTrail } from "App/Utils/Interfaces";

export default class User extends BaseModel {
  @column({ isPrimary: true })
  public id: number;

  @column()
  public id_number: string;
  @column()
  public password?: string;

  @column()
  public rol_id?: number;

  @column()
  public status: number;
  @column()
  public audit_trail: IAuditTrail;
}
