import { BaseModel, column, HasOne, hasOne } from "@ioc:Adonis/Lucid/Orm";
import { IAuditTrail, ISurnames } from "App/Utils/interfaces";
import { INames } from "App/Utils/interfaces";
import Status from "./Status";
import User from "./User";

export default class DetailsUser extends BaseModel {
  @column({ isPrimary: true })
  public id: number;

  @column()
  public society_type: string;
  @column()
  public entity_type: string;
  @column()
  public politics?: boolean;
  @column()
  public notification?: boolean;

  @column()
  public dependency: string;
  @column()
  public subdependency: string;

  @column()
  public id_type: string;
  @column()
  public id_number: string;
  @column()
  public names: INames;
  @column()
  public surnames: ISurnames;
  @column()
  public email: string;
  @column()
  public location: string;
  @column()
  public cellphone_number?: number;
  @column()
  public phone_number: number;
  @column()
  public phone_number_ext?: number;
  @column()
  public gender: string;

  @column()
  public user_id: number;

  @column()
  public status: number;
  @column()
  public audit_trail: IAuditTrail;

  // Foreign Key Relation
  @hasOne(() => Status, { foreignKey: "id", localKey: "status" })
  public status_info: HasOne<typeof Status>;

  @hasOne(() => User, { foreignKey: "id", localKey: "user_id" })
  public user_info: HasOne<typeof User>;
}
