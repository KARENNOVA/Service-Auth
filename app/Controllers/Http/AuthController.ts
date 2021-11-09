import jwt from "jsonwebtoken";
import { HttpContextContract } from "@ioc:Adonis/Core/HttpContext";
import Env from "@ioc:Adonis/Core/Env";
import {
  authenticationUme,
  base64encode,
  bcryptCompare,
  bcryptEncode,
} from "App/Utils/functions";
import User from "App/Models/User";
import AuditTrail from "App/Utils/classes/AuditTrail";

export default class AuthController {
  /**
   * index
   */
  public async index(ctx: HttpContextContract) {
    let autenticacion;

    try {
      autenticacion = await authenticationUme();
      console.log(autenticacion);
    } catch (error) {
      console.error(error);
      return ctx.response.send("error in autenticacion");
    }

    try {
      return ctx.response.status(200).json({
        info: { action: "registrarInfoPersona" },
        persona: {
          tipo_sociedad: "N-Persona Natural",
          tipo_entidad: "NINGUNO",
          tipo_identificacion: "1-Cedula de Ciudadania",
          documento: "1017242383",
          nombres: "Ficticio Prueba",
          apellidos: "Listo ejemplo",
          correo: "prueba@axcelsoftware.com",
          direccion: "calle falsa 123",
          barrio: "Candelaria",
          telefono: "5814766",
          celular: "300102000",
          pais: "CO",
          departamento: "05-ANTIOQUIA",
          municipio: "05001-MEDELLÍN",
          politica: "true",
          notificacion: "false",
          genero: "f",
        },
        autenticacion,
      });
    } catch (error) {
      console.error(error);
      return ctx.response
        .status(500)
        .json({ message: "Request to Projects failed!", error });
    }
  }

  /**
   * signIn
   */
  public async signIn({}: HttpContextContract) {}

  /**
   * index
   */
  public async _index(ctx: HttpContextContract) {
    const { passwordNaked } = ctx.request.qs();

    try {
      const passwordEncrypt = await bcryptEncode(passwordNaked);

      const passEncryptBase64 = await base64encode(passwordEncrypt);

      return ctx.response.json({ passwordEncrypt, passEncryptBase64 });
    } catch (error) {
      console.error(error);

      return ctx.response.json({ message: "Error" });
    }
  }

  // POST
  /**
   * create
   */
  public async create(ctx: HttpContextContract) {
    const { idNumber, passwordNaked } = ctx.request.body();
    let passEncryptBase64: string, userEncryptBase64: string;

    const auditTrail: AuditTrail = new AuditTrail();

    // Double encrypt.
    try {
      userEncryptBase64 = await base64encode(String(idNumber));
    } catch (error) {
      console.error(error);

      return ctx.response.json({ message: "Error user" });
    }

    try {
      const passwordEncrypt = await bcryptEncode(passwordNaked);

      passEncryptBase64 = await base64encode(passwordEncrypt);
    } catch (error) {
      console.error(error);

      return ctx.response.json({ message: "Error pass" });
    }

    try {
      const user = await User.create({
        id_number: userEncryptBase64,
        password: passEncryptBase64,
        rol_id: 1,
        status: 1,
        audit_trail: auditTrail.getAsJson(),
      });

      return ctx.response.status(200).json({ message: "Usuario creado", user });
    } catch (error) {
      console.error(error);
      return ctx.response
        .status(500)
        .json({ message: "Hubo un error al crear el Proyecto." });
    }
  }

  /**
   * logIn
   */
  public async logIn(ctx: HttpContextContract) {
    let { idNumber, passwordNaked, attemp = 0 } = ctx.request.body();
    let passEncryptBase64: string, userEncryptBase64: string;

    // const auditTrail: IAuditTrail = newAuditTrail();

    // Double encrypt.
    try {
      userEncryptBase64 = await base64encode(String(idNumber));
    } catch (error) {
      console.error(error);

      return ctx.response.json({ message: "Error user" });
    }

    try {
      const passwordEncrypt = await bcryptEncode(passwordNaked);

      passEncryptBase64 = await base64encode(passwordEncrypt);
    } catch (error) {
      console.error(error);

      return ctx.response.json({ message: "Error pass" });
    }

    // ********************************

    try {
      const user = await User.query()
        .where("id_number", userEncryptBase64)
        .innerJoin("roles", "user.rol_id", "roles.id");
      console.log(user);

      const boolPass = await bcryptCompare(passEncryptBase64, user[0].password);

      if (boolPass) {
        var token = jwt.sign(
          {
            id: user[0].id,
            rol: user[0].rol_id,
            audit_trail: user[0].audit_trail,
          },
          Env.get("APP_KEY") || "secret"
        );
        return ctx.response.status(200).json({ message: "Usuario", token });
      } else {
        if (attemp > 10) {
          return ctx.response.status(400).json({
            message:
              "Usuario o Contraseña Incorrecto.\nDemasiados intentos realizados, por favor espere...",
            attemp,
          });
        } else attemp += 1;

        return ctx.response
          .status(400)
          .json({ message: "Usuario o Contraseña Incorrecto.", attemp });
      }
    } catch (error) {
      console.error(error);
      return ctx.response
        .status(500)
        .json({ message: "Hubo un error al obtener el Usuario." });
    }
  }
}
