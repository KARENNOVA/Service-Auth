import { BaseModel, column } from "@ioc:Adonis/Lucid/Orm";
import { IAuditTrail } from "App/Utils/interfaces";

export default class RolePermit extends BaseModel {
  @column({ isPrimary: true })
  public id: number;

  @column()
  public role_id: number;
  @column()
  public permit_id: number;

  @column()
  public status: number;
  @column()
  public audit_trail: IAuditTrail;
}
