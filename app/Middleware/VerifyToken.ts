import { HttpContextContract } from "@ioc:Adonis/Core/HttpContext";
import User from "App/Models/User";
import { decodeJWT } from "App/Utils/functions/jwt";

export default class VerifyToken {
  public async handle(
    { request, response }: HttpContextContract,
    next: () => Promise<void>
  ) {
    let payload;
    const token = request
      .headers()
      ["authorization"]?.split("Bearer")
      .pop()
      ?.trim();
    if (token) payload = decodeJWT(token);

    // Consulting
    try {
      User.findOrFail(payload.id);
    } catch (error) {
      console.error(error);
      response.unauthorized({
        error: "Debe de ingresar para realizar esta acción",
      });
    }

    await next();
  }
}
