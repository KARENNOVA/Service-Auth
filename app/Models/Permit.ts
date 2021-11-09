import { BaseModel, column } from "@ioc:Adonis/Lucid/Orm";
import { IAuditTrail } from "App/Utils/interfaces";
import { IActions } from "App/Utils/interfaces/permit.interface";

export default class Permit extends BaseModel {
  @column({ isPrimary: true })
  public id: number;

  @column()
  public name: string;
  @column()
  public modules: string[];
  @column()
  public actions: IActions;

  @column()
  public status: number;
  @column()
  public audit_trail: IAuditTrail;
}
