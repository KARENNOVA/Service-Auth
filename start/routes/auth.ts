import Route from "@ioc:Adonis/Core/Route";

Route.group(() => {
  // GET
  Route.get("/", async (ctx) => {
    const { default: AuthController } = await import(
      "App/Controllers/Http/AuthController"
    );

    return new AuthController().index(ctx);
  });

  // Route.get("/lists", async (ctx) => {
  //   const { default: RealEstatesController } = await import(
  //     "App/Controllers/Http/RealEstatesController"
  //   );

  //   if (!ctx.request.qs().q) return new RealEstatesController().getList(ctx);

  //   return new RealEstatesController().filter(ctx);
  // });

  // POST
  Route.post("/", async (ctx) => {
    const { default: AuthController } = await import(
      "App/Controllers/Http/AuthController"
    );
    return new AuthController().create(ctx);
  });

  Route.post("/login", async (ctx) => {
    const { default: AuthController } = await import(
      "App/Controllers/Http/AuthController"
    );
    return new AuthController().logIn(ctx);
  });

  // PUT
  // Route.put("/", async (ctx) => {
  //   const { default: RealEstatesController } = await import(
  //     "App/Controllers/Http/RealEstatesController"
  //   );
  //   return new RealEstatesController().update(ctx);
  // });

  // DELETE
  // Route.delete("/delete", async (ctx) => {
  //   const { default: RealEstatesController } = await import(
  //     "App/Controllers/Http/RealEstatesController"
  //   );
  //   return new RealEstatesController().delete(ctx);
  // });
}).prefix("v1/auth");
