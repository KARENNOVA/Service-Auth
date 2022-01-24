import { HttpContextContract } from "@ioc:Adonis/Core/HttpContext";
import { getToken } from "App/Utils/functions/jwt";
import { IResponseData } from "App/Utils/interfaces";

export default class VerifyToken {
  public async handle(
    { request, response }: HttpContextContract,
    next: () => Promise<void>
  ) {
    let responseData: IResponseData = {
      message: "Debe de ingresar para realizar esta acción.",
      error: true,
      status: 401,
    };
    const { token, payloadToken } = getToken(request.headers());

    if (payloadToken === undefined) {
      responseData["message"] =
        "Token expirado. Iniciar sesión de nuevo para poder continuar.";
      return response.unauthorized(responseData);
    }

    if (
      token === "" ||
      (payloadToken["iat"] === -1 && payloadToken["id"] === -1)
    ) {
      return response.unauthorized(responseData);
    }

    await next();
  }
}
