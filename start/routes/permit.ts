import Route from "@ioc:Adonis/Core/Route";

Route.group(() => {
  Route.get("/", async (ctx) => {
    const { default: PermitsController } = await import(
      "App/Controllers/Http/PermitsController"
    );

    // if (ctx.request.qs().id) return new PermitsController().show(ctx);

    return new PermitsController().showAll(ctx);
  });

  //   Route.get("/", async (ctx) => {
  //     const { default: RolesController } = await import(
  //       "App/Controllers/Http/RolesController"
  //     );

  //     return new RolesController().getDataUser(ctx);
  //   });

  // POST
  //   Route.post("/", async (ctx) => {
  //     const { default: RolesController } = await import(
  //       "App/Controllers/Http/RolesController"
  //     );
  //     return new RolesController().create(ctx);
  //   });

  //   // PUT
  //   Route.put("/", async (ctx) => {
  //     const { default: RolesController } = await import(
  //       "App/Controllers/Http/RolesController"
  //     );
  //     return new RolesController().update(ctx);
  //   });

  //   Route.delete("/:id", async (ctx) => {
  //     const { default: RolesController } = await import(
  //       "App/Controllers/Http/RolesController"
  //     );
  //     return new RolesController().inactivate(ctx);
  //   });
}).prefix("v1/permits");
