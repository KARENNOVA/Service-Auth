import { HttpContextContract } from "@ioc:Adonis/Core/HttpContext";
import Database from "@ioc:Adonis/Lucid/Database";
import Permit from "App/Models/Permit";
import { IResponseData } from "./../../Utils/interfaces/index";

export default class PermitsController {
  public async index({}: HttpContextContract) {}

  public async create({}: HttpContextContract) {}

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
        .orderBy("id", "desc");

      dataResponse.results = permits;
      return response.status(200).json(dataResponse);
    } catch (error) {
      console.error(error);
    }
  }

  public async edit({}: HttpContextContract) {}

  public async update({}: HttpContextContract) {}

  public async destroy({}: HttpContextContract) {}
}
