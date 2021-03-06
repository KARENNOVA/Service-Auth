import Route from "@ioc:Adonis/Core/Route";
import Env from "@ioc:Adonis/Core/Env";

const apiVersion = Env.get("API_VERSION");

Route.group(() => {
  Route.get("/", async (ctx) => {
    const { default: RolesController } = await import(
      "App/Controllers/Http/RolesController"
    );

    if (ctx.request.qs().id) return new RolesController().show(ctx);

    return new RolesController().showAll(ctx);
  });

  // POST
  Route.post("/", async (ctx) => {
    const { default: RolesController } = await import(
      "App/Controllers/Http/RolesController"
    );

    return new RolesController().create(ctx);
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
    return new RolesController().update(ctx);
  });

  Route.delete("/:id", async (ctx) => {
    const { default: RolesController } = await import(
      "App/Controllers/Http/RolesController"
    );
    return new RolesController().inactivate(ctx);
  });
})
  .prefix(`${apiVersion}/roles`)
  .middleware(["verifyToken", "logRegistered"]);
