const Koa = require("koa");
const body = require("koa-body");

const app = new Koa();

app.use(body());

const routes = require('./routes.js');

app.use(routes.routes());

app.listen(3000);
