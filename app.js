const Koa = require("koa");
const body = require("koa-body");
const Router = require("koa-router");

const app = new Koa();

app.use(body());

// setup routes
const router = new Router({
  prefix: "/fastest-animals",
});

let fastAnimals = [
  { id: 1, name: "Peregrine falcon", speed: "240 mph" },
  { id: 2, name: "Golden eagle", speed: "200 mph" },
  { id: 3, name: "White-throated needletail swift", speed: "106 mph" },
  { id: 4, name: "Mexican free-tailed bat", speed: "100 mph" },
  { id: 5, name: "Rock dove", speed: "93 mph" },
];

router.get("/", (ctx, next) => {
  ctx.body = fastAnimals;
  next();
});

router.get("/:id", (ctx, next) => {
  let getCurrentAnimal = fastAnimals.filter((animal) => {
    if (animal.id == ctx.params.id) {
      return true;
    }
  });
  if (getCurrentAnimal.length) {
    ctx.body = getCurrentAnimal[0];
  } else {
    ctx.response.status = 404;
    ctx.body = "Animal not found;";
  }
  next();
});

router.post("/new", (ctx, next) => {
  if (
    !ctx.request.body.id ||
    !ctx.request.body.name ||
    !ctx.request.body.speed
  ) {
    ctx.response.status = 400;
    ctx.body = "Please enter the data";
  } else if (fastAnimals.find((animal) => animal.id == ctx.request.body.id)) {
    ctx.response.status = 400;
    ctx.body = "The id already exists, please enter another one.";
  } else {
    fastAnimals.push({
      id: ctx.request.body.id,
      name: ctx.request.body.name,
      speed: ctx.request.body.speed,
    });
    ctx.response.status = 201;
    ctx.body = `New animal added with id: ${ctx.request.body.id} and name: ${ctx.request.body.name}`;
  }
  next();
});

// creating an object with curl:
// curl -X POST --data "id={id}&name={name}&speed={speed}" http://localhost:3000/fastest-animals/new

router.put("/update", (ctx, next) => {
  if (
    !ctx.request.body.id ||
    !ctx.request.body.name ||
    !ctx.request.body.speed
  ) {
    ctx.response.status = 400;
    ctx.body = "Please enter the data";
  } else {
    const existingAnimal = fastAnimals.find(
      (animal) => animal.id == ctx.request.body.id
    );
    if (existingAnimal) {
      fastAnimals[existingAnimal.id] = {
        id: ctx.request.body.id,
        name: ctx.request.body.name,
        speed: ctx.request.body.speed,
      };
      ctx.response.status = 201;
      ctx.body = `Animal with id: ${ctx.request.body.id} was updated ${existingAnimal.id}`;
    } else {
      fastAnimals.push({
        id: ctx.request.body.id,
        name: ctx.request.body.name,
        speed: ctx.request.body.speed,
      });
      ctx.response.status = 201;
      ctx.body = `New animal added with id: ${ctx.request.body.id} and name: ${ctx.request.body.name}`;
    }
  }
  next();
});

// updating an object with curl:
// curl -X PUT --data "id={id}&name={name}&speed={speed}" http://localhost:3000/fastest-animals/update

router.delete("/remove/:id", (ctx, next) => {
  const removeIndex = fastAnimals
    .map((animal) => animal.id)
    .indexOf(parseInt(ctx.params.id, 10));
  if (removeIndex === -1) {
    ctx.response.status = 400;
    ctx.body = `The id does not exist, please enter another one. ${ctx.params.id}`;
  } else {
    ctx.response.status = 201;
    fastAnimals.splice(removeIndex, 1);
    ctx.body = `Animal with id: ${ctx.params.id} was removed`;
  }
  next();
});

// deleting an object with curl:
// curl -X DELETE --data http://localhost:3000/fastest-animals/remove/{id}

// invoke routes
app.use(router.routes());

app.listen(3000);
