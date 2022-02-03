import { HttpContextContract } from "@ioc:Adonis/Core/HttpContext";
import Role from "App/Models/Role";
import AuditTrail from "App/Utils/classes/AuditTrail";
import { IPayloadRole, IRole } from "App/Utils/interfaces/role";
import CreateRoleValidator from "App/Validators/CreateRoleValidator";
import UpdateRoleValidator from "App/Validators/UpdateRoleValidator";
import {
  assignPermits,
  changeStatus,
  messageError,
  sum,
  validatePagination,
} from "../../Utils/functions";
import { IResponseData } from "../../Utils/interfaces/index";

// MODELS
import UserRole from "App/Models/UserRole";
import RolePermit from "App/Models/RolePermit";
import { getToken } from "App/Utils/functions/jwt";
import { IPaginationValidated } from "App/Utils/interfaces/pagination";
import { generalDeleteMultiple } from '../../Utils/functions/index';

export default class RolesController {
  public async index({}: HttpContextContract) {}

  public async create({ request, response }: HttpContextContract) {
    const payload: IPayloadRole = await request.validate(CreateRoleValidator);
    let message: string = "Rol creado correctamente.";

    try {
      let dataRole: IRole = { ...payload, role_name: payload["name"] };

      if (dataRole["name"]) delete dataRole["name"];
      if (dataRole["permits"]) delete dataRole["permits"];
      dataRole["status"] = 1;

      const { token } = getToken(request.headers());

      const auditTrail: AuditTrail = new AuditTrail(token);
      await auditTrail.init();
      dataRole["audit_trail"] = auditTrail.getAsJson();

      const role = await Role.create({ ...dataRole });

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
    rolesToCreate?: any[]
  ) {
    let roles;
    if (rolesToCreate) roles = rolesToCreate;
    else roles = request.body()["roles"];

    const { to } = request.qs();

    const { token } = getToken(request.headers());

    try {
      const auditTrail = new AuditTrail(token);
      await auditTrail.init();

      let tmp: any[] = [];
      roles.map((role) => {
        tmp.push({
          user_id: to,
          role_id: role,
          status: 1,
          audit_trail: auditTrail.getAsJson(),
        });
      });

      const results = await UserRole.createMany(tmp);

      if (rolesToCreate) return results;

      return response.status(200).json({
        message: "Roles asignados.",
        results,
      });
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
      status: 200,
    };

    try {
      const permitsByRole = await RolePermit.query()
        .from("role_permits as rp")
        .innerJoin("roles as r", "rp.role_id", "r.id")
        .innerJoin("permits as p", "rp.permit_id", "p.id")
        // .innerJoin("status as s", "rp.status", "s.id")
        .where("rp.role_id", parseInt(id));

      // Assign and organized permits in array
      let permits: any[] = [];

      console.log(permitsByRole);

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
      const role = await Role.find(id);

      if (role !== null)
        dataResponse["results"] = { name: role["role_name"], permits: [] };
      else
        return response.status(500).json({
          message:
            "Ha ocurrido un error inesperado al obtener los valores.\nRevisar Terminal.",
        });
    }
    return response.status(200).json(dataResponse);
  }

  public async list({ response, request }: HttpContextContract) {
    let responseData: IResponseData = {
      message: "Lista de Roles completa. | Sin paginación.",
      status: 200,
    };
    const { page, pageSize, key, value, only } = request.qs();

    let pagination: IPaginationValidated = { page: 0, pageSize: 1000000 };
    if (request.qs().with && request.qs().with === "pagination") {
      pagination = validatePagination(key, value, page, pageSize);
      responseData["message"] = "Lista de Roles completa. | Con paginación.";
    }

    let results: any[] = [],
      data: any[] = [];

    let count: number =
      pagination["page"] > 0
        ? pagination["page"] * pagination["pageSize"] - pagination["pageSize"]
        : 0;

    try {
      results = await Role.query()
        .preload("status_info")
        .select(["id as role_id", "*"])
        .orderBy("id", "desc")
        .limit(pagination["pageSize"])
        .offset(count);

      if (pagination["page"] !== 0)
        results = await Role.query()
          .preload("status_info")
          .select(["id as role_id", "*"])
          .whereRaw(
            `${pagination["search"]!["key"]} LIKE '%${
              pagination["search"]!["value"]
            }%'`
          )
          .orderBy("id", "desc")
          .limit(pagination["pageSize"])
          .offset(count);
      // .where(
      //   pagination["search"]!["key"],
      //   "LIKE",
      //   `%${pagination["search"]!["value"]}%`
      // )

      if (only) {
        const num = only === "active" ? 1 : 0;
        results = await Role.query()
          .preload("status_info")
          .select(["id as role_id", "*"])
          .whereRaw(
            `${pagination["search"]!["key"]} LIKE '%${
              pagination["search"]!["value"]
            }%'`
          )
          .where("status", num)
          .orderBy("id", "desc")
          .limit(pagination["pageSize"])
          .offset(count);
      }
    } catch (error) {
      return messageError(error, response);
    }

    try {
      results.map((role) => {
        let tmpNewData: any = {
          ...role["$original"],
          id: role["$extras"]["role_id"],
          status: role["$preloaded"]["status_info"]["$extras"]["status_name"],
        };

        delete tmpNewData.cost_center_id;
        data.push(tmpNewData);
      });

      // Total Results
      try {
        responseData["total_results"] = (
          await Role.query().where("status", 1)
        ).length;
      } catch (error) {
        console.error(error);
        return response.status(500).json({
          message: "Error al traer la lista de todos los Bienes Inmuebles.",
        });
      }

      // Count
      count = results.length;

      // Next Page
      responseData["next_page"] =
        pagination["page"] * pagination["pageSize"] <
          responseData["total_results"] && pagination["page"] !== 0
          ? sum(parseInt(pagination["page"] + ""), 1)
          : null;

      // Previous Page
      responseData["previous_page"] =
        pagination["page"] - 1 > 0 && pagination["page"] !== 0
          ? pagination["page"] - 1
          : null;

      let res = data;
      if (responseData["next_page"] === null) {
        const lastElement = data.pop() as Role;
        res = [lastElement, ...data];
      }

      // responseData["message"] = "Lista de Usuarios";
      responseData["results"] = res;
      responseData["page"] = pagination["page"];
      responseData["count"] = count;

      return response.json(responseData);
      // }

      // try {
      //   roles = await Role.query().where("status", 1).orderBy("id", "desc");

      //   dataResponse["results"] = roles;
      //   dataResponse["total"] = roles.length;

      //   return response.status(200).json(dataResponse);
    } catch (error) {
      return messageError(
        error,
        response,
        "Ha ocurrido un error inesperado al obtener los Roles."
      );
    }
  }

  public async edit({}: HttpContextContract) {}

  public async update({ request, response }: HttpContextContract) {

    const { token } = getToken(request.headers());
    const payload: IPayloadRole = await request.validate(UpdateRoleValidator);
    const { id } = request.qs();

    let responseData: IResponseData = {
      message: "Rol actualizado correctamente.",
      status: 200,
    };
    let newData: any = { ...payload, role_name: payload["name"] };
    if (newData.permits) delete newData.permits;
    delete newData.name;

    try {
      const role = await Role.findOrFail(id);

      let tmpToken: string = "";
      if (token) tmpToken = token;

      const auditTrail = new AuditTrail(tmpToken, role.audit_trail);
      await auditTrail.update(newData, role);

      // Updating data
      try {
        const roleUpdated = await role
          .merge({
            ...newData,
            audit_trail: auditTrail.getAsJson(),
          })
          .save();

        if (payload.permits && payload.permits.length > 0) {
          await generalDeleteMultiple("role_permits", { column: "role_id", value: id })
          const { success } = await assignPermits(
            payload["permits"],
            auditTrail,
            role.id
          );

          if (success) console.log("Permisos actualizados");
          else
            return response.status(500).json({
              message: "Error creando la relación de permisos al rol.",
            });
        }

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
  public async inactivate({ request, response }: HttpContextContract) {
    const { id } = request.params();

    const { token } = getToken(request.headers());

    const { success, results } = await changeStatus(
      Role,
      id,
      "inactivate",
      token
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
