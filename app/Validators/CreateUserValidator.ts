import { schema, rules } from "@ioc:Adonis/Core/Validator";
import { HttpContextContract } from "@ioc:Adonis/Core/HttpContext";

export default class CreateUserValidator {
  constructor(protected ctx: HttpContextContract) {}

  /*
   * Define schema to validate the "shape", "type", "formatting" and "integrity" of data.
   *
   * For example:
   * 1. The username must be of data type string. But then also, it should
   *    not contain special characters or numbers.
   *    ```
   *     schema.string({}, [ rules.alpha() ])
   *    ```
   *
   * 2. The email must be of data type string, formatted as a valid
   *    email. But also, not used by any other user.
   *    ```
   *     schema.string({}, [
   *       rules.email(),
   *       rules.unique({ table: 'users', column: 'email' }),
   *     ])
   *    ```
   */
  public schema = schema.create({
    user: schema.object().members({
      id_number: schema.number(),
      password: schema.string.optional({ trim: true }),
    }),
    detailsUser: schema.object().members({
      id_type: schema.string({ trim: true }),
      names: schema.object().members({
        firstName: schema.string({ trim: true }),
        lastName: schema.string({ trim: true }),
      }),
      surnames: schema.object().members({
        firstSurname: schema.string({ trim: true }),
        lastSurname: schema.string({ trim: true }),
      }),
      email: schema.string({ trim: true }, [
        rules.email(),
        rules.unique({ table: "details_users", column: "email" }),
      ]),
      location: schema.string({ trim: true }),
      cellphone_number: schema.number(),
      phone_number: schema.number(),
      gender: schema.string({ trim: true }),
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
