import jwt from "jsonwebtoken";
import { HttpContextContract } from "@ioc:Adonis/Core/HttpContext";
import Env from "@ioc:Adonis/Core/Env";
import {
  base64encode,
  bcryptCompare,
  generarAutentificacion,
  getToken,
  messageError,
} from "App/Utils/functions";
import User from "App/Models/User";
import { IResponseData } from "App/Utils/interfaces";
import { logInUser, registerUser } from "./../../Services/alcMedellin";

export default class AuthController {
  /**
   * index
   */
  public async index({ response }: HttpContextContract) {
    let autenticacion;
    try {
      autenticacion = await generarAutentificacion();
    } catch (error) {
      console.error(error);
      return response.send("error in autenticacion");
    }

    let data = {
      info: { action: "registrarInfoPersona" },
      persona: {
        tipo_sociedad: "N-Persona Natural",
        tipo_entidad: "NINGUNO",
        tipo_identificacion: "1-Cedula de Ciudadanía",
        documento: "1000416139",
        nombres: "Ficticio Prueba",
        apellidos: "Listo ejemplo",
        correo: "santiago.suarez@dation.co",
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
    };

    const axiosResponse = await registerUser(data);
    console.log(axiosResponse);

    try {
      return response.status(200).json(data);
    } catch (error) {
      console.error(error);
      return response
        .status(500)
        .json({ message: "Request to Projects failed!", error });
    }
  }

  /**
   * logInAlcaldia
   */
  public async logInAlcaldia({ response, request }: HttpContextContract) {
    let autenticacion;
    try {
      autenticacion = await generarAutentificacion();
    } catch (error) {
      return messageError(
        error,
        response,
        "Error al generar la información de autentificación contra UME."
      );
    }
    let data = {
      info: {
        action: "inicioSesion",
        usuario: request.body().user,
        contra: request.body().password,
      },

      autenticacion,
    };

    const axiosResponse = await logInUser(data);
    console.log(axiosResponse);

    try {
      return response.status(200).json(data);
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
        await this.logOut(
          { response, request } as HttpContextContract,
          user["$attributes"]["id"]
        );

        var token = jwt.sign(
          {
            id: user["$attributes"].id,
            // exp: Math.floor(Date.now() / 1000) + (60 * 60),
          },
          Env.get("APP_KEY") || "secret",
          { expiresIn: "1d" }
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
          "Usuario o Contraseña incorrecta.",
          400
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
  public async logOut({ response, request }: HttpContextContract, id?: number) {
    let responseData: IResponseData = {
      message: "Cierre de sesión exitoso.",
      status: 200,
    };
    let idUser = 0;
    if (id) {
      idUser = id;
    } else {
      const { payloadToken } = getToken(request.headers());
      idUser = payloadToken["id"];
    }

    let user: User;
    try {
      user = await User.findOrFail(idUser);
    } catch (error) {
      return messageError(
        error,
        response,
        "Error inesperado al obtener el Usuario.",
        400
      );
    }

    try {
      await user.merge({ online: false, sid: null }).save();
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

  /**
   * registerSID
   */
  public async registerSID({ response, request }: HttpContextContract) {
    let responseData: IResponseData = {
      message: "SID registrado correctamente",
      status: 200,
    };

    const { id, sid } = request.qs();
    let user: User;

    try {
      user = await User.findOrFail(id);
    } catch (error) {
      return messageError(error, response, `Usuario con ID ${id} no existe.`);
    }

    try {
      responseData["results"] = await user.merge({ sid }).save();
    } catch (error) {
      return messageError(error, response, "Error al registrar el SID");
    }

    return response.status(responseData["status"]).json(responseData);
  }
}
