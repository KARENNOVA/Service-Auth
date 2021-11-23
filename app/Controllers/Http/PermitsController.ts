import { HttpContextContract } from "@ioc:Adonis/Core/HttpContext";
import Database from "@ioc:Adonis/Lucid/Database";
import Permit from "App/Models/Permit";
import AuditTrail from "App/Utils/classes/AuditTrail";
import { messageError } from "App/Utils/functions";
import { IResponseData } from "../../Utils/interfaces/index";
import UserPermit from "App/Models/UserPermit";

export default class PermitsController {
  public async index({}: HttpContextContract) {}

  public async create({}: HttpContextContract) {}

  /**
   * assign
   */
  public async assign(
    { request, response }: HttpContextContract,
    token?: string
  ) {
    const permits = request.body()["permits"];
    const { to } = request.qs();

    let tmpToken: string = "";
    if (token) tmpToken = token.replace("Bearer ", "");
    console.log(tmpToken);

    try {
      const auditTrail = new AuditTrail(tmpToken);

      let tmp: any[] = [];
      permits.map((permit) => {
        tmp.push({
          user_id: to,
          permit_id: permit,
          status: 1,
          audit_trail: auditTrail.getAsJson(),
        });
      });
      console.log(tmp);

      const results = await UserPermit.createMany(tmp);
      console.log(results);
    } catch (error) {
      console.error(error);
      return response.status(500).json({
        message:
          "Ha ocurrido un error inesperado al asignar los Permisos.\nRevisar Terminal.",
      });
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
      console.log(permitsByRole);

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
    let dataResponse: IResponseData = { message: "Todos los permisos" };

    try {
      const permits = await Permit.query()
        .where("status", 1)
        .orderBy("id", "asc");

      dataResponse["results"] = permits;
      dataResponse["total"] = permits.length;
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
