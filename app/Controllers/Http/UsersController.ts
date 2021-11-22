// import bcrypt from "bcrypt";
import { HttpContextContract } from "@ioc:Adonis/Core/HttpContext";
import DetailsUser from "App/Models/DetailsUser";
import Role from "App/Models/Role";
import User from "App/Models/User";
import AuditTrail from "App/Utils/classes/AuditTrail";
import {
  IDataUserPayload,
  IDetailsUser,
  IUserPayload,
} from "App/Utils/interfaces";
import CreateUserValidator from "App/Validators/CreateUserValidator";
import { IUser } from "../../Utils/interfaces/user";
import { base64encode } from "App/Utils/functions";
import { bcryptEncode } from "../../Utils/functions/auth";

export default class UsersController {
  /**
   * getRoles
   */
  public async getRoles(ctx: HttpContextContract) {
    try {
      const roles = await Role.all();
      console.log(roles);

      return ctx.response.status(200).json({ results: roles });
    } catch (error) {
      console.error(error);

      return ctx.response
        .status(500)
        .json({ message: "Request to Roles failed!", error });
    }
  }

  /**
   * setRole
   */
  public async setRole({}: HttpContextContract) {
    try {
      User.all();
    } catch (error) {}
  }

  /**
   * getDataUser
   */
  public async getDataUser({}: HttpContextContract) {}

  // POST
  /**
   * createUser
   */
  private async createUser(reqDataUser: IDataUserPayload): Promise<any> {
    const auditTrail = new AuditTrail();
    let passwordHashed;

    if (typeof reqDataUser["password"] === "string")
      // passwordHashed = bcrypt.hashSync(reqDataUser["password"], 10);
      passwordHashed = await bcryptEncode(reqDataUser["password"]);

    let newUser: IUser = {
      ...reqDataUser,
      id_number: await base64encode(String(reqDataUser["id_number"])),
      password: passwordHashed,
      status: 1,
      audit_trail: auditTrail.getAsJson(),
    };

    try {
      const user = await User.create(newUser);
      return { user, auditTrail };
    } catch (error) {
      console.error(error);
      if (error.code === "23505")
        return Promise.reject(
          'El usuario ya existe.\nSi no recuerda la contraseña ir a la sección de "¿Olvidó su Contraseña?"'
        );

      return Promise.reject(
        "A ocurrido un error inesperado al crear el Usuario."
      );
    }
  }

  private async createDetailsUser(
    id: number,
    reqDetailsUser: any,
    auditTrail: AuditTrail
  ) {
    let tmpDetailsUser: IDetailsUser = {
      society_type: "",
      entity_type: "",
      politics: false,
      notification: false,

      id_type: reqDetailsUser.id_type.trim(),
      id_number: reqDetailsUser.id_number,

      names: reqDetailsUser.names,
      surnames: reqDetailsUser.surnames,
      email: reqDetailsUser.email,
      location: reqDetailsUser.location,
      cellphone_number: reqDetailsUser.cellphone_number,
      phone_number: reqDetailsUser.phone_number,
      gender: reqDetailsUser.gender,

      user_id: id,
      status: 1,
      audit_trail: auditTrail.getAsJson(),
    };

    try {
      const detailsUser = await DetailsUser.create({
        ...tmpDetailsUser,
      });
      return detailsUser;
    } catch (error) {
      console.error(error);
      return Promise.reject(
        "A ocurrido un error inesperado al crear los detalles del Usuario."
      );
    }
  }

  /**
   * create
   */
  public async create({ response, request }: HttpContextContract) {
    const payload: IUserPayload = await request.validate(CreateUserValidator);

    try {
      const { user, auditTrail } = await this.createUser(payload["user"]);

      const detailsUser = await this.createDetailsUser(
        user.id,
        { ...payload["detailsUser"], id_number: payload["user"]["id_number"] },
        auditTrail
      );
      return response.status(200).json({
        message: "Usuario creado correctamente.",
        results: { user, detailsUser },
      });
    } catch (error) {
      console.error(error);

      return response.status(500).json({
        message: error,
      });
    }
  }
}
