import { BaseModel, column } from "@ioc:Adonis/Lucid/Orm";
import { IAuditTrail } from "App/Utils/interfaces";

export default class Permit extends BaseModel {
  @column({ isPrimary: true })
  public id: number;

  @column()
  public permit_name: string;

  @column()
  public status: number;
  @column()
  public audit_trail: IAuditTrail;
}
