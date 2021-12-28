import { BaseModel, column, HasOne, hasOne } from "@ioc:Adonis/Lucid/Orm";
import { IAuditTrail } from "App/Utils/interfaces";
import Status from "./Status";

export default class Role extends BaseModel {
  @column({ isPrimary: true })
  public id: number;

  @column()
  public role_name: string;

  @column()
  public status: number;
  @column()
  public audit_trail: IAuditTrail;

  // Foreign Key Relation
  @hasOne(() => Status, { foreignKey: "id", localKey: "status" })
  public status_info: HasOne<typeof Status>;
}
