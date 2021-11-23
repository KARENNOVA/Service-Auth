import Route from "@ioc:Adonis/Core/Route";
import Env from "@ioc:Adonis/Core/Env";

const apiVersion = Env.get("API_VERSION");

Route.group(() => {
  Route.get("/", async (ctx) => {
    const { default: PermitsController } = await import(
      "App/Controllers/Http/PermitsController"
    );

    // if (ctx.request.qs().id) return new PermitsController().show(ctx);

    return new PermitsController().showAll(ctx);
  });

  Route.post("/assign", async (ctx) => {
    const { default: PermitsController } = await import(
      "App/Controllers/Http/PermitsController"
    );
    return new PermitsController().assign(
      ctx,
      ctx.request.headers().authorization
    );
  });

  //   Route.get("/", async (ctx) => {
  //     const { default: PermitsController } = await import(
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
})
  .prefix(`${apiVersion}/permits`)
  .middleware(["verifyToken", "logRegistered"]);
