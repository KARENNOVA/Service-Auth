import { HttpContextContract } from "@ioc:Adonis/Core/HttpContext";
import Role from "App/Models/Role";
import AuditTrail from "App/Utils/classes/AuditTrail";
import { IPayloadRole, IRole } from "App/Utils/interfaces/role.interface";
import CreateRoleValidator from "App/Validators/CreateRoleValidator";
import UpdateRoleValidator from "App/Validators/UpdateRoleValidator";
import { assignPermits, changeStatus } from "./../../Utils/functions";
import { IResponseData } from "./../../Utils/interfaces/index";

export default class RolesController {
  public async index({}: HttpContextContract) {}

  public async create({ request, response }: HttpContextContract) {
    const payload: IPayloadRole = await request.validate(CreateRoleValidator);
    let message: string = "Rol creado correctamente.";

    try {
      let dataRole: IRole = { ...payload };

      if (dataRole["permits"]) delete dataRole["permits"];
      dataRole["status"] = 1;

      const auditTrail: AuditTrail = new AuditTrail();
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

  public async store({}: HttpContextContract) {}

  public async show({}: HttpContextContract) {}

  public async showAll({ response }: HttpContextContract) {
    try {
      const roles = await Role.query().where("status", 1).orderBy("id", "desc");

      return response.status(200).json({
        message: "Rol creado correctamente.",
        results: roles,
      });
    } catch (error) {
      console.error(error);
      return response.status(500).json({
        message: "A ocurrido un error inesperado al obtener los Roles.",
        error,
      });
    }
  }

  public async edit({}: HttpContextContract) {}

  public async update({ request, response }: HttpContextContract) {
    const payload: IPayloadRole = await request.validate(UpdateRoleValidator);
    const { id } = request.qs();
    let responseData: IResponseData = {
      message: "Rol actualizado correctamente.",
    };
    let newData: any = { ...payload };
    if (newData.permits) delete newData.permits;

    try {
      const role = await Role.findOrFail(id);

      const auditTrail = new AuditTrail(undefined, role.audit_trail);
      auditTrail.update("Administrador", newData, role);

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
        ] = `Rol ${roleUpdated.name} actualizado correctamente.`;
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
  public async inactivate({ request, response }: HttpContextContract) {
    const { id } = request.params();

    const { success, results } = await changeStatus(Role, id, "inactivate");

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
