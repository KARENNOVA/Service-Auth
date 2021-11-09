import Route from "@ioc:Adonis/Core/Route";

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
}).prefix("v1/users");
