// import bcrypt from "bcrypt";
import { HttpContextContract } from "@ioc:Adonis/Core/HttpContext";
import DetailsUser from "App/Models/DetailsUser";
import User from "App/Models/User";
import AuditTrail from "App/Utils/classes/AuditTrail";
import {
  IDataUserPayload,
  IDetailsUser,
  IUserPayload,
} from "App/Utils/interfaces";
import CreateUserValidator from "App/Validators/CreateUserValidator";
import { IUser } from "../../Utils/interfaces/user";
import {
  base64encode,
  getPermitsAndRoles,
  sum,
  validatePagination,
} from "App/Utils/functions";
import { decodeJWT, getToken } from "App/Utils/functions/jwt";
import { bcryptEncode } from "./../../Utils/functions/auth";
import { changeStatus } from "./../../Utils/functions/index";
import UserRole from "./../../Models/UserRole";
import UserPermit from "./../../Models/UserPermit";

export default class UsersController {
  /**
   * getDataUser
   */
  public async getDataUser({ response, request }: HttpContextContract) {
    const { id } = request.qs();

    let detailsUser;
    let payloadToken;
    const token = request
      .headers()
      ["authorization"]?.split("Bearer")
      .pop()
      ?.trim();
    if (token) payloadToken = decodeJWT(token);

    const { roles, permits } = await getPermitsAndRoles(request, response, id);

    // let flag: boolean = false;

    // permits?.map((permit) => {
    //   if (permit.name === "detalles_Usuarios") flag = true;
    // });

    // if (!flag)
    //   return response
    //     .status(403)
    //     .json({ message: "No posee los permisos para ver un Usuario." });

    const userId = id ? id : payloadToken.id;

    try {
      detailsUser = await DetailsUser.query()
        .from("details_users as du")
        .innerJoin("status as s", "du.status", "s.id")
        .select(["du.id as du_id", "*"])
        .where("user_id", userId);
    } catch (error) {
      console.error(error);
    }

    detailsUser = {
      ...detailsUser[0]["$attributes"],
      id: detailsUser[0]["$extras"]["du_id"],
      status: detailsUser[0]["$extras"]["status_name"],
    };

    delete detailsUser["user_id"];

    response.status(200).json({
      message: "Detalles del Usuario",
      results: { detailsUser, roles, permits },
    });
  }

  /**
   * showAll
   */
  public async showAll({ response, request }: HttpContextContract) {
    const { q, page, pageSize } = request.qs();
    const tmpWith = request.qs().with;
    const pagination = validatePagination(q, page, pageSize);
    let results, detailsUser;
    let count: number =
      pagination["page"] * pagination["pageSize"] - pagination["pageSize"];

    try {
      if (tmpWith === "pagination")
        results = await DetailsUser.query()
          .from("details_users as du")
          .innerJoin("status as s", "du.status", "s.id")
          .select(["du.id as du_id", "*"])
          .where("du.status", 1)
          .orderBy("du.id", "desc")
          .limit(pagination["pageSize"])
          .offset(count);
      else
        results = await DetailsUser.query()
          .from("details_users as du")
          .innerJoin("status as s", "du.status", "s.id")
          .select(["du.id as du_id", "*"])
          .where("du.status", 1)
          .orderBy("du.id", "desc");

      results = results === null ? [] : results;
      let data: any[] = [];

      results.map((realEstate) => {
        let tmpNewData: any = {
          ...realEstate["$attributes"],
          id: realEstate["$extras"]["du_id"],
          status: realEstate["$extras"]["status_name"],
        };

        data.push(tmpNewData);
      });

      // Total Results
      try {
        detailsUser = await DetailsUser.query().where("status", 1);
      } catch (error) {
        console.error(error);
        return response.status(500).json({
          message: "Error al traer la lista de todos los Bienes Inmuebles.",
        });
      }
      const total_results = detailsUser.length;

      // Count
      count = results.length;

      // Next Page
      let next_page: number | null =
        pagination["page"] * pagination["pageSize"] < detailsUser.length
          ? sum(parseInt(pagination["page"] + ""), 1)
          : null;

      // Previous Page
      let previous_page: number | null =
        pagination["page"] - 1 > 0 ? pagination["page"] - 1 : null;

      const lastElement = data.pop();
      const res = [lastElement, ...data];

      return response.json({
        message: "Lista de Usuarios",
        results: res,
        page: pagination["page"],
        count,
        next_page,
        previous_page,
        total_results,
      });
    } catch (error) {
      console.error(error);
      return response.status(500).json({ message: "Request to Users failed!" });
    }
  }

  public async getRolesAndPermits({ response, request }: HttpContextContract) {
    const { id } = request.qs();

    const { roles, permits } = await getPermitsAndRoles(request, response, id);

    response
      .status(200)
      .json({ message: "Roles y Permisos", results: { roles, permits } });
  }

  // POST
  /**
   * createUser
   */
  private async createUser(
    reqDataUser: IDataUserPayload,
    token: string | undefined
  ): Promise<any> {
    let tmpToken: string = "";
    if (token) tmpToken = token;
    const auditTrail = new AuditTrail(tmpToken);
    await auditTrail.init();

    let passwordHashed;

    if (typeof reqDataUser["password"] === "string")
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
      society_type: reqDetailsUser.society_type,
      entity_type: reqDetailsUser.entity_type,
      politics: false,
      notification: false,

      dependency: reqDetailsUser.dependency,
      subdependency: reqDetailsUser.subdependency,

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
    const token = getToken(request.headers());

    const { permits } = await getPermitsAndRoles(request, response);
    let flag: boolean = false;

    permits?.map((permit) => {
      if (permit.name === "crear_Usuarios") flag = true;
    });

    if (!flag)
      return response
        .status(403)
        .json({ message: "No posee los permisos para crear un Usuario." });

    const payload: IUserPayload = await request.validate(CreateUserValidator);

    try {
      const { user, auditTrail } = await this.createUser(
        payload["user"],
        token
      );

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

  /**
   * update
   */
  public async update({ response, request }: HttpContextContract) {
    const newData = request.body();
    const { id } = request.qs();
    const token = getToken(request.headers());

    try {
      if (typeof id === "string") {
        const detailsUser = await DetailsUser.findOrFail(id);
        let dataUpdated: any = {
          ...newData.detailsUser,
        };

        const auditTrail = new AuditTrail(token, detailsUser.audit_trail);
        auditTrail.update({ ...dataUpdated }, detailsUser);
        dataUpdated["audit_trail"] = auditTrail.getAsJson();

        // Updating data
        try {
          await detailsUser.merge({
            ...dataUpdated,
          });

          await detailsUser.save();
        } catch (error) {
          console.error(error);
          return response
            .status(500)
            .json({ message: "Error al actualizar: Servidor", error });
        }

        if (newData.user.password) {
          const user = await User.findByOrFail(
            "id_number",
            detailsUser.id_number
          );

          // Updating data
          try {
            await user.merge({
              password: await bcryptEncode(newData.user.password),
              audit_trail: auditTrail.getAsJson(),
            });
            await user.save();
          } catch (error) {
            console.error(error);
            return response
              .status(500)
              .json({ message: "Error al actualizar: Servidor", error });
          }
        }
        return response.status(200).json({
          message: `Usuario ${detailsUser.names.firstName} actualizado satisfactoriamente`,
          results: detailsUser,
        });
      }
    } catch (error) {
      console.error(error);
      return response
        .status(500)
        .json({ message: "Error interno: Servidor", error });
    }
  }

  /**
   * inactivate
   */
  public async inactivate({ request, response }: HttpContextContract) {
    const token = getToken(request.headers());
    const { id } = request.qs();
    // let user: User, detailsUser: DetailsUser;

    try {
      await User.findOrFail(id);
      await DetailsUser.findOrFail(id);
    } catch (error) {
      return response.status(400).json({
        message: `El id [${id}] de usuario no existe, verificar si se encuentra creado.`,
      });
    }

    const { success, results } = await changeStatus(
      User,
      id,
      "inactivate",
      token
    );

    if (success) {
      const { success, results } = await changeStatus(
        DetailsUser,
        id,
        "inactivate",
        token
      );

      if (success) {
        try {
          const userRoles = await UserRole.query().where("user_id", id);
          userRoles.map(async (ur) => {
            await ur.delete();
          });

          const userPermits = await UserPermit.query().where("user_id", id);
          userPermits.map(async (up) => {
            await up.delete();
          });

          return await response
            .status(200)
            .json({ message: "Usuario inactivado y datos asociados." });
        } catch (error) {
          console.error(error);

          return response.status(500).json({
            message: `Error al eliminar las relaciones de roles y permisos`,
          });
        }
      } else {
        console.error(results);
        return response
          .status(400)
          .json({ message: `Error al inactivar los datos del usuario` });
      }
    } else {
      console.error(results);
      return response
        .status(400)
        .json({ message: `Error al inactivar el usuario` });
    }
  }
}
