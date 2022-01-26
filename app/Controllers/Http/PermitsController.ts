import { HttpContextContract } from "@ioc:Adonis/Core/HttpContext";
import Database from "@ioc:Adonis/Lucid/Database";
import PermitModel from "App/Models/Permit";
import UserPermit from "App/Models/UserPermit";

// UTILS
import { IResponseData, IUserPermit } from "App/Utils/interfaces";
import { messageError, validatePermit } from "App/Utils/functions";
import { getToken } from "App/Utils/functions";
import AuditTrail from "App/Utils/classes/AuditTrail";
import { Permit } from "App/Utils/_types";

export default class PermitsController {
  public async index({}: HttpContextContract) {}

  public async create({}: HttpContextContract) {}

  /**
   * Assign permits to one User by ID User
   */
  public async assign({ request, response }: HttpContextContract) {
    // Validations
    const { token } = getToken(request.headers());

    const hasPermit = await validatePermit(
      response,
      request,
      token,
      Permit.ASSIGN_ROLEPERMIT
    );

    if (!hasPermit) {
      return messageError(
        undefined,
        response,
        `No posee el permiso (${Permit.ASSIGN_ROLEPERMIT}) para asignar permisos.`,
        401
      );
    }

    const { to } = request.qs();

    if (!to)
      return messageError(
        undefined,
        response,
        "Ingrese el ID del usuario. [ to ]",
        400
      );
    // END Validations

    let responseData: IResponseData = {
      message: `Permisos asignados al usuario con ID: ${to}`,
      status: 200,
    };
    const permits = request.body()["permits"];

    const auditTrail = new AuditTrail(token);
    await auditTrail.init();

    try {
      let dataToInsert: IUserPermit[] = [];
      permits.map((permit) => {
        dataToInsert.push({
          user_id: to,
          permit_id: permit,
          status: 1,
          audit_trail: auditTrail.getAsJson(),
        });
      });

      const results = await UserPermit.createMany(dataToInsert);

      responseData["results"] = results;

      return response.status(responseData["status"]).json(responseData);
    } catch (error) {
      return messageError(
        error,
        response,
        "Ha ocurrido un error inesperado al asignar los Permisos.\nRevisar Terminal."
      );
    }
  }

  public async store({}: HttpContextContract) {}

  public async show({ request, response }: HttpContextContract) {
    const { id } = request.qs();

    try {
      const permitsByRole = await Database.rawQuery(`
      select json_build_object('id',rp.rol_id, 'name', r."name") as role , json_agg(jsonb_build_object('id', rp.permit_id, 'name', p."name")) as permits
      from rol_permits rp
      LEFT OUTER JOIN roles r on rp.rol_id = r.id
      LEFT OUTER JOIN permits p on rp.permit_id = p.id
      where rp.status = 1
        and rp.rol_id = ${id}
      group by rp.rol_id, r."name" ;
    `);

      return response
        .status(200)
        .json({ message: "Permisos por Rol", results: permitsByRole.rows[0] });
    } catch (error) {
      console.error(error);
      return response.status(500).json({
        message:
          "A ocurrido un error inesperado al obtener los Permisos por Rol.",
        error,
      });
    }
  }

  public async showAll({ response }: HttpContextContract) {
    let dataResponse: IResponseData = {
      message: "Todos los permisos",
      status: 200,
    };

    try {
      const permits = await PermitModel.query()
        .select(["id", "permit_name"])
        .where("status", 1)
        .orderBy("id", "asc");

      dataResponse["results"] = permits;
      dataResponse["total_results"] = permits.length;
      return response.status(200).json(dataResponse);
    } catch (error) {
      return messageError(
        error,
        response,
        "Ha ocurrido un error inesperado al obtener los permisos."
      );
    }
  }

  public async edit({}: HttpContextContract) {}

  public async update({ response }: HttpContextContract) {
    try {
    } catch (error) {
      return messageError(
        error,
        response,
        "Ha ocurrido un error inesperado al actualizar los permisos."
      );
    }
  }

  public async destroy({}: HttpContextContract) {}
}
