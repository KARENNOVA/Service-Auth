import jwt from "jsonwebtoken";
import { HttpContextContract } from "@ioc:Adonis/Core/HttpContext";
import Env from "@ioc:Adonis/Core/Env";
import {
  authenticationUme,
  base64encode,
  bcryptCompare,
  getToken,
  messageError,
} from "App/Utils/functions";
import User from "App/Models/User";
import { IResponseData } from "App/Utils/interfaces";

export default class AuthController {
  /**
   * index
   */
  public async index({ response }: HttpContextContract) {
    let autenticacion;
    try {
      autenticacion = await authenticationUme();
      console.log(autenticacion);
    } catch (error) {
      console.error(error);
      return response.send("error in autenticacion");
    }
    try {
      return response.status(200).json({
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
      return response
        .status(500)
        .json({ message: "Request to Projects failed!", error });
    }
  }

  // POST
  /**
   * logIn
   */
  public async logIn({ response, request }: HttpContextContract) {
    let responseData: IResponseData = {
      message: "¡Inicio de Sesión exitoso!",
      status: 200,
    };
    let { idNumber, password64, attemp = 0 } = request.body();
    let userEncryptBase64: string;

    // Double encrypt.
    try {
      userEncryptBase64 = await base64encode(String(idNumber));
    } catch (error) {
      console.error(error);

      return messageError(
        error,
        response,
        "Error al encriptar el usuario.",
        500
      );
    }
    // ********************************

    try {
      const user = (
        await User.query().where("id_number", userEncryptBase64)
      )[0];

      const boolPass = await bcryptCompare(password64, user.password);

      if (boolPass) {
        var token = jwt.sign(
          {
            id: user["$attributes"].id,
            // exp: Math.floor(Date.now() / 1000) + (60 * 60),
          },
          Env.get("APP_KEY") || "secret"
        );
        responseData["results"] = token;

        try {
          await user.merge({ online: true }).save();
        } catch (error) {
          return messageError(
            error,
            response,
            "Error al registrar el Inicio de Sesión."
          );
        }

        return response.status(responseData["status"]).json(responseData);
      } else {
        if (attemp > 10) {
          return messageError(
            { attemp },
            response,
            "Usuario o Contraseña Incorrecto.\nDemasiados intentos realizados, por favor espere...",
            400
          );
        } else attemp += 1;

        return messageError(
          { attemp },
          response,
          "Usuario o Contraseña incorrecta."
        );
      }
    } catch (error) {
      return messageError(
        error,
        response,
        "Error inesperado al obtener el usuario."
      );
    }
  }

  /**
   * logOut
   */
  public async logOut({ response, request }: HttpContextContract) {
    let responseData: IResponseData = {
      message: "Cierre de sesión exitoso.",
      status: 200,
    };
    const { payloadToken } = getToken(request.headers());

    let user: User;
    try {
      user = await User.findOrFail(payloadToken["id"]);
    } catch (error) {
      return messageError(
        error,
        response,
        "Error inesperado al obtener el Usuario.",
        400
      );
    }

    try {
      await user.merge({ online: false }).save();
    } catch (error) {
      return messageError(
        error,
        response,
        "Error inesperado al quitar el registro de inicio de sesión del Usuario.",
        400
      );
    }

    return response.status(responseData["status"]).json(responseData);
  }
}
