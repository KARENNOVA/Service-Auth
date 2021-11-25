import Route from "@ioc:Adonis/Core/Route";
import Env from "@ioc:Adonis/Core/Env";

const apiVersion = Env.get("API_VERSION");

Route.group(() => {
  Route.get("/", async (ctx) => {
    const { default: RolesController } = await import(
      "App/Controllers/Http/RolesController"
    );
    // const { default: PermitsController } = await import(
    //   "App/Controllers/Http/PermitsController"
    // );

    if (ctx.request.qs().id) return new RolesController().show(ctx);

    return new RolesController().showAll(ctx);
  });

  //   Route.get("/", async (ctx) => {
  //     const { default: RolesController } = await import(
  //       "App/Controllers/Http/RolesController"
  //     );

  //     return new RolesController().getDataUser(ctx);
  //   });

  // POST
  Route.post("/", async (ctx) => {
    const { default: RolesController } = await import(
      "App/Controllers/Http/RolesController"
    );

    return new RolesController().create(
      ctx,
      ctx.request.headers().authorization
    );
  });

  Route.post("/assign", async (ctx) => {
    const { default: RolesController } = await import(
      "App/Controllers/Http/RolesController"
    );
    return new RolesController().assign(ctx);
  });

  // PUT
  Route.put("/", async (ctx) => {
    const { default: RolesController } = await import(
      "App/Controllers/Http/RolesController"
    );
    return new RolesController().update(
      ctx,
      ctx.request.headers().authorization
    );
  });

  Route.delete("/:id", async (ctx) => {
    const { default: RolesController } = await import(
      "App/Controllers/Http/RolesController"
    );
    return new RolesController().inactivate(
      ctx,
      ctx.request.headers().authorization
    );
  });
})
  .prefix(`${apiVersion}/roles`)
  .middleware(["verifyToken", "logRegistered"]);
