const Koa = require("koa");
const body = require("koa-body");

const app = new Koa();

const mongoose = require("mongoose");
mongoose.connect("mongodb://localhost/my_db");

const db = mongoose.connection;

db.on("error", console.error.bind(console, "MongoDB connection error:"));

app.use(body());
const routes = require("./routes.js");
app.use(routes.routes());

app.listen(3000);
