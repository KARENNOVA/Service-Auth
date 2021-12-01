import Env from "@ioc:Adonis/Core/Env";
import Route from "@ioc:Adonis/Core/Route";

const apiVersion = Env.get("API_VERSION");

Route.group(() => {
  Route.get("/", async (ctx) => {
    const { default: UsersController } = await import(
      "App/Controllers/Http/UsersController"
    );

    if (ctx.request.qs().id) return new UsersController().getDataUser(ctx);

    return new UsersController().showAll(ctx);
  });

  Route.get("/roles-and-permits", async (ctx) => {
    const { default: UsersController } = await import(
      "App/Controllers/Http/UsersController"
    );

    return new UsersController().getRolesAndPermits(ctx);
  });

  // POST
  Route.post("/", async (ctx) => {
    const { default: UsersController } = await import(
      "App/Controllers/Http/UsersController"
    );
    return new UsersController().create(ctx);
  });

  Route.put("/", async (ctx) => {
    const { default: UsersController } = await import(
      "App/Controllers/Http/UsersController"
    );
    return new UsersController().update(ctx);
  });

  Route.delete("/", async (ctx) => {
    const { default: UsersController } = await import(
      "App/Controllers/Http/UsersController"
    );
    return new UsersController().inactivate(ctx);
  });
})
  .prefix(`${apiVersion}/users`)
  .middleware(["logRegistered", "verifyToken"]);
