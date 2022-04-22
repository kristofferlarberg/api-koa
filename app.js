const Koa = require("koa");
const body = require('koa-body')

const app = new Koa();

app.use(async (ctx) => {
  ctx.body = "Hello World";
});

app.listen(3000);
