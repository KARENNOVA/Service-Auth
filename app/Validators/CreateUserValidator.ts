import { schema, rules } from "@ioc:Adonis/Core/Validator";
import { HttpContextContract } from "@ioc:Adonis/Core/HttpContext";

export default class CreateUserValidator {
  constructor(protected ctx: HttpContextContract) {}

  public schema = schema.create({
    user: schema.object().members({
      id_number: schema.number(),
      password: schema.string.optional({ trim: true }),
    }),
    detailsUser: schema.object().members({
      id_type: schema.string({ trim: true }),
      names: schema.object().members({
        firstName: schema.string({ trim: true }),
        lastName: schema.string.optional({ trim: true }),
      }),
      surnames: schema.object().members({
        firstSurname: schema.string({ trim: true }),
        lastSurname: schema.string.optional({ trim: true }),
      }),
      email: schema.string({ trim: true }, [
        rules.email(),
        rules.unique({ table: "details_users", column: "email" }),
      ]),
      location: schema.string({ trim: true }),
      cellphone_number: schema.number(),
      phone_number: schema.number(),
      gender: schema.string({ trim: true }),
      society_type: schema.string({ trim: true }),
      entity_type: schema.string({ trim: true }),
      dependency: schema.string.optional({ trim: true }),
      subdependency: schema.string.optional({ trim: true }),
    }),
  });

  /**
   *
   * {
   *   'profile.username.required': 'Username is required',
   *   'scores.*.number': 'Define scores as valid numbers'
   * }
   *
   */
  public messages = {};
}
