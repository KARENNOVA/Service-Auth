import { HttpContextContract } from "@ioc:Adonis/Core/HttpContext";
import User from "App/Models/User";
import { messageError } from "App/Utils/functions";
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
      status: 200,
    };
    const { token } = getToken(request.headers());

    // Get data of Token
    let payload: IDataToken = { id: -1, iat: -1 };
    if (token !== "") payload = decodeJWT(token);

    if (token === "" || (payload["iat"] === -1 && payload["id"] === -1)) {
      return messageError(undefined, response, responseData["message"], 401);
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
