import { HttpContextContract } from "@ioc:Adonis/Core/HttpContext";
import moment from "moment";

export default class LogRequest {
  public async handle(
    { request }: HttpContextContract,
    next: () => Promise<void>
  ) {
    console.log(
      `[ ${moment().date()} | ${request.ip()} ]\t-> ${request.method()}:\t${request.url()}`
    );
    await next();
  }
}
