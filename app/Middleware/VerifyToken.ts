import { HttpContextContract } from "@ioc:Adonis/Core/HttpContext";
import User from "App/Models/User";
import { decodeJWT, getToken } from "App/Utils/functions/jwt";
import { IDataToken } from "App/Utils/interfaces";
import { IResponseData } from "App/Utils/interfaces/index";

export default class VerifyToken {
  public async handle(
    { request, response }: HttpContextContract,
    next: () => Promise<void>
  ) {
    let responseData: IResponseData = {
      message: "Debe de ingresar para realizar esta acción.",
      error: true,
    };
    const { token } = getToken(request.headers());

    // Get data of Token
    let payload: IDataToken = { id: -1, iat: -1 };
    if (token !== "") payload = decodeJWT(token);

    if (token === "" || (payload["iat"] === -1 && payload["id"] === -1)) {
      return response.unauthorized(responseData);
    }

    // Validating ID User | SABI
    try {
      await User.findOrFail(payload.id);
    } catch (error) {
      console.error(error);
      responseData["message"] = "ID del Usuario no existe.";
      return response.status(500).json(responseData);
    }

    await next();
  }
}
