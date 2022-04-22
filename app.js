const Koa = require("koa");
const body = require("koa-body");
const Router = require("koa-router");

const app = new Koa();

app.use(body());

// setup routes
const router = new Router({
  prefix: "/fastest-animals",
});

let fastestAnimals = [
  { id: 1, name: "Peregrine falcon", speed: "240 mph" },
  { id: 2, name: "Golden eagle", speed: "200 mph" },
  { id: 3, name: "White-throated needletail swift", speed: "106 mph" },
  { id: 4, name: "Mexican free-tailed bat", speed: "100 mph" },
  { id: 5, name: "Rock dove", speed: "93 mph" },
];

router.get("/", (ctx, next) => {
  ctx.body = fastestAnimals;
  next();
});

// invoke routes
app.use(router.routes());

// app.use(async (ctx) => {
//   ctx.body = "Hello World";
// });

app.listen(3000);
