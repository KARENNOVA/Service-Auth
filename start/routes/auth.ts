import Route from "@ioc:Adonis/Core/Route";
import Env from "@ioc:Adonis/Core/Env";

const apiVersion = Env.get("API_VERSION");

Route.group(() => {
  // GET
  Route.get("/", async (ctx) => {
    const { default: AuthController } = await import(
      "App/Controllers/Http/AuthController"
    );

    return new AuthController().index(ctx);
  });

  // POST
  Route.post("/login", async (ctx) => {
    const { default: AuthController } = await import(
      "App/Controllers/Http/AuthController"
    );
    return new AuthController().logIn(ctx);
  });

  Route.post("/log-out", async (ctx) => {
    const { default: AuthController } = await import(
      "App/Controllers/Http/AuthController"
    );
    return new AuthController().logOut(ctx);
  });
})
  .prefix(`${apiVersion}/auth`)
  .middleware("logRegistered");
