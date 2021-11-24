import { HttpContextContract } from "@ioc:Adonis/Core/HttpContext";
import Role from "App/Models/Role";
import AuditTrail from "App/Utils/classes/AuditTrail";
import { IPayloadRole, IRole } from "App/Utils/interfaces/role.interface";
import CreateRoleValidator from "App/Validators/CreateRoleValidator";
import UpdateRoleValidator from "App/Validators/UpdateRoleValidator";
import {
  assignPermits,
  changeStatus,
  messageError,
} from "../../Utils/functions";
import { IResponseData } from "../../Utils/interfaces/index";

// MODELS
import UserRole from "App/Models/UserRole";
import RolePermit from "App/Models/RolePermit";

export default class RolesController {
  public async index({}: HttpContextContract) {}

  public async create(
    { request, response }: HttpContextContract,
    token?: string
  ) {
    const payload: IPayloadRole = await request.validate(CreateRoleValidator);
    let message: string = "Rol creado correctamente.";

    try {
      let dataRole: IRole = { ...payload };

      if (dataRole["permits"]) delete dataRole["permits"];
      dataRole["status"] = 1;

      let tmpToken = "";
      if (token) tmpToken = token;

      const auditTrail: AuditTrail = new AuditTrail(tmpToken);
      dataRole["audit_trail"] = auditTrail.getAsJson();

      const role = await Role.create({ ...dataRole });
      console.log(role);

      if (payload["permits"].length > 0) {
        const { success } = await assignPermits(
          payload["permits"],
          auditTrail,
          role.id
        );

        if (success)
          message = `Rol creado con ${
            payload["permits"].length > 1
              ? `${payload["permits"].length} permisos.`
              : `${payload["permits"].length} permiso.`
          }`;
        else
          return response.status(500).json({
            message: "Error creando la relación de permisos al rol.",
          });
      }

      return response.status(200).json({
        message,
        results: role,
      });
    } catch (error) {
      console.error(error);
      return response.status(500).json({
        message: "A ocurrido un error inesperado al crear el Rol.",
        error,
      });
    }
  }

  /**
   * assign
   */
  public async assign(
    { request, response }: HttpContextContract,
    token?: string
  ) {
    const roles = request.body()["roles"];
    const { to } = request.qs();

    let tmpToken: string = "";
    if (token) tmpToken = token;

    try {
      const auditTrail = new AuditTrail(tmpToken);

      let tmp: any[] = [];
      roles.map((role) => {
        tmp.push({
          user_id: to,
          role_id: role,
          status: 1,
          audit_trail: auditTrail.getAsJson(),
        });
      });
      console.log(tmp);

      const results = await UserRole.createMany(tmp);
      console.log(results);
    } catch (error) {
      console.error(error);
      return response.status(500).json({
        message:
          "Ha ocurrido un error inesperado al asignar los Roles.\nRevisar Terminal.",
      });
    }
  }

  public async store({}: HttpContextContract) {}

  public async show({ request, response }: HttpContextContract) {
    const { id } = request.qs();
    let dataResponse: IResponseData = {
      message: "Información detallada del rol ",
    };

    try {
      const permitsByRole = await RolePermit.query()
        .from("role_permits as rp")
        .innerJoin("roles as r", "rp.role_id", "r.id")
        .innerJoin("permits as p", "rp.permit_id", "p.id")
        .innerJoin("status as s", "rp.status", "s.id")
        .where("rp.role_id", parseInt(id));
      console.log(permitsByRole);

      // Assign and organized permits in array
      let permits: any[] = [];

      permitsByRole.map((permit) => {
        let tmp: any = {
          id: permit["$original"]["permit_id"],
          name: permit["$extras"]["permit_name"],
        };

        permits.push(tmp);
      });

      // Organized object of results
      let results: any = {
        name: permitsByRole[0]["$extras"]["role_name"],
        permits,
      };

      dataResponse["results"] = results;

      return response.status(200).json(dataResponse);
    } catch (error) {
      console.error(error);
      return response.status(500).json({
        message:
          "Ha ocurrido un error inesperado al obtener los valores.\nRevisar Terminal.",
      });
    }
  }

  public async showAll({ response }: HttpContextContract) {
    let dataResponse: IResponseData = { message: "Todos los roles." };

    try {
      const roles = await Role.query().where("status", 1).orderBy("id", "desc");

      dataResponse["results"] = roles;
      dataResponse["total"] = roles.length;

      return response.status(200).json(dataResponse);
    } catch (error) {
      return messageError(
        error,
        response,
        "Ha ocurrido un error inesperado al obtener los Roles."
      );
    }
  }

  public async edit({}: HttpContextContract) {}

  public async update(
    { request, response }: HttpContextContract,
    token?: string
  ) {
    const payload: IPayloadRole = await request.validate(UpdateRoleValidator);
    const { id } = request.qs();
    let responseData: IResponseData = {
      message: "Rol actualizado correctamente.",
    };
    let newData: any = { ...payload };
    if (newData.permits) delete newData.permits;

    try {
      const role = await Role.findOrFail(id);

      let tmpToken: string = "";
      if (token) tmpToken = token;

      const auditTrail = new AuditTrail(tmpToken, role.audit_trail);
      auditTrail.update(newData, role);

      // Updating data
      try {
        const roleUpdated = await role
          .merge({
            ...newData,
            audit_trail: auditTrail.getAsJson(),
          })
          .save();

        // if (payload.permits )

        responseData[
          "message"
        ] = `Rol ${roleUpdated.role_name} actualizado correctamente.`;
        responseData["results"] = roleUpdated;

        return response.status(200).json(responseData);
      } catch (error) {
        console.error(error);
        console.error(error.message);

        return response.status(500).json({
          message: "Error al actualizar: Servidor",
          error: { name: error.name },
        });
      }
    } catch (error) {
      let message: string =
          "A ocurrido un error inesperado al actualizar el Rol.",
        status: number = 500;

      console.error(error.message);
      console.error(error);
      if (error.message === "E_ROW_NOT_FOUND: Row not found") {
        message = "No se ha encontrado un Rol para el ID buscado.";
        status = 400;
      }
      return response.status(status).json({
        message,
        error: { name: error.name },
      });
    }
  }

  /**
   * inactivate
   */
  public async inactivate(
    { request, response }: HttpContextContract,
    token?: string
  ) {
    const { id } = request.params();

    let tmpToken: string = "";
    if (token) tmpToken = token;

    const { success, results } = await changeStatus(
      Role,
      id,
      "inactivate",
      tmpToken
    );

    if (success)
      return response.status(200).json({
        message: "Rol inactivado",
        results,
      });
    else {
      let message: string =
          "A ocurrido un error inesperado al inactivar el Rol.",
        status: number = 500;

      console.error(results.message);
      console.error(results);
      if (results.message === "E_ROW_NOT_FOUND: Row not found") {
        message = "No se ha encontrado un Rol para el ID buscado.";
        status = 400;
      }
      return response.status(status).json({
        message,
        error: { name: results.name },
      });
    }
  }

  public async destroy({}: HttpContextContract) {}
}
