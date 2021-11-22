import Env from "@ioc:Adonis/Core/Env";
import Route from "@ioc:Adonis/Core/Route";

const apiVersion = Env.get("API_VERSION");

Route.group(() => {
  Route.get("/", async (ctx) => {
    const { default: UsersController } = await import(
      "App/Controllers/Http/UsersController"
    );

    return new UsersController().getDataUser(ctx);
  });

  // POST
  Route.post("/", async (ctx) => {
    const { default: UsersController } = await import(
      "App/Controllers/Http/UsersController"
    );
    return new UsersController().create(ctx);
  });
}).prefix(`${apiVersion}/users`);
