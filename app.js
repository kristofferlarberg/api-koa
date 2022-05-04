const Koa = require("koa");
const body = require("koa-body");

const app = new Koa();

const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/my_db');

const noteSchema = mongoose.Schema({
  id: Number,
  content: String,
});

var Note = mongoose.model("Note", noteSchema);

app.use(body());
const routes = require('./routes.js');
app.use(routes.routes());

app.listen(3000);
