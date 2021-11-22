import jwt from "jsonwebtoken";
import { HttpContextContract } from "@ioc:Adonis/Core/HttpContext";
import Env from "@ioc:Adonis/Core/Env";
import {
  authenticationUme,
  base64encode,
  bcryptCompare,
} from "App/Utils/functions";
import User from "App/Models/User";

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

  // POST
  /**
   * logIn
   */
  public async logIn({ response, request }: HttpContextContract) {
    let { idNumber, password64, attemp = 0 } = request.body();
    let userEncryptBase64: string;

    // Double encrypt.
    try {
      userEncryptBase64 = await base64encode(String(idNumber));
    } catch (error) {
      console.error(error);

      return response
        .status(500)
        .json({ message: "Error al encriptar el usuario." });
    }
    // ********************************

    try {
      const user = await User.query().where("id_number", userEncryptBase64);

      const boolPass = await bcryptCompare(password64, user[0].password);

      if (boolPass) {
        var token = jwt.sign(
          {
            id: user[0].id,
            // exp: Math.floor(Date.now() / 1000) + (60 * 60),
          },
          Env.get("APP_KEY") || "secret"
        );
        return response
          .status(200)
          .json({ message: "¡Ingreso exitoso!", results: token });
      } else {
        if (attemp > 10) {
          return response.status(400).json({
            message:
              "Usuario o Contraseña Incorrecto.\nDemasiados intentos realizados, por favor espere...",
            attemp,
          });
        } else attemp += 1;

        return response
          .status(400)
          .json({ message: "Usuario o Contraseña Incorrecto.", attemp });
      }
    } catch (error) {
      console.error(error);
      return response
        .status(500)
        .json({ message: "Hubo un error al obtener el Usuario." });
    }
  }
}
