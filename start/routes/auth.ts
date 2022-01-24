import Route from "@ioc:Adonis/Core/Route";
import Env from "@ioc:Adonis/Core/Env";

const apiVersion = Env.get("API_VERSION");

Route.group(() => {
  // GET
  Route.post("/", async (ctx) => {
    const { default: AuthController } = await import(
      "App/Controllers/Http/AuthController"
    );

    return new AuthController().index(ctx);
  });

  Route.post("/log-in-ume", async (ctx) => {
    const { default: AuthController } = await import(
      "App/Controllers/Http/AuthController"
    );

    return new AuthController().logInAlcaldia(ctx);
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

  Route.get("/sid", async (ctx) => {
    const { default: AuthController } = await import(
      "App/Controllers/Http/AuthController"
    );
    return new AuthController().registerSID(ctx);
  });
})
  .prefix(`${apiVersion}/auth`)
  .middleware("logRegistered");
