import { HttpContextContract } from "@ioc:Adonis/Core/HttpContext";
import { Logger } from "App/Utils/classes/Logger";
import { Manager } from "App/Utils/enums";
// import moment from "moment";

export default class LogRequest {
  public async handle(
    { request }: HttpContextContract,
    next: () => Promise<void>
  ) {
    const logger = new Logger(request.ip(), Manager.LogRequest);

    const register = logger.register(13, request.method(), request.url());
    console.log(register);

    await next();
  }
}
