import Route from "@ioc:Adonis/Core/Route";

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
}).prefix("v1/auth");
