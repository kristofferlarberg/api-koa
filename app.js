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
  let getCurrentAnimal = fastAnimals.filter(function (animal) {
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
  } else {
    let newAnimal = fastAnimals.push({
      id: ctx.request.body.id,
      name: ctx.request.body.name,
      author: ctx.request.body.speed,
    });
    ctx.response.status = 201;
    ctx.body = `New animal added with id: ${ctx.request.body.id} and name: ${ctx.request.body.name}`;
  }
  next();
});

// Try making a post with curl: 
// curl -X POST --data "id=10&name=Skata&speed=10%20mph" http://localhost:3000/fastest-animals/new

// invoke routes
app.use(router.routes());

app.listen(3000);
