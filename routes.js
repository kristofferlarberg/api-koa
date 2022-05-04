const Router = require("koa-router");
const Model = require("./models");

// setup routes
const router = new Router();

router.get("/", (ctx, next) => {
  ctx.body = "Hello world";
  next();
});

router.get("/notes", async (ctx, next) => {
  try {
    const Notes = await Model.find();
    ctx.body = Notes;
  } catch (error) {
    ctx.response.status = 500;
    ctx.body = `${error}`;
  }
  next();
});

router.get("/notes/:id", async (ctx, next) => {
  try {
    const existingNote = await Model.find({ _id: ctx.params.id });
    if (existingNote.length > 0) {
      ctx.body = existingNote;
    } else {
      ctx.body = `Note with id ${ctx.params.id} was not found`;
    }
  } catch {
    ctx.response.status = 500;
    ctx.body = `${error}`;
  }
  next();
});

router.post("/notes", async (ctx, next) => {
  try {
    if (!ctx.request.body.title || !ctx.request.body.content) {
      ctx.response.status = 400;
      ctx.body = "Please enter the data";
    } else {
      const note = new Model({
        title: ctx.request.body.title,
        content: ctx.request.body.content,
      });
      note.save();
      ctx.response.status = 201;
      ctx.body = `New note added with title: ${ctx.request.body.title}`;
    }
  } catch (error) {
    ctx.response.status = 500;
    ctx.body = `${error}`;
  }
  next();
});

// todo: add try catch
router.put("/notes/:id", async (ctx, next) => {
  const note = new Model({
    title: ctx.request.body.title,
    content: ctx.request.body.content,
  });
  const existingNote = await Model.find({ _id: ctx.params.id });
  if (!ctx.request.body.title || !ctx.request.body.content) {
    ctx.response.status = 400;
    ctx.body = "Please enter the data";
  } else {
    if (!existingNote) {
      note.save();
      ctx.response.status = 201;
      ctx.body = `New note added with title: ${ctx.request.body.title}`;
    } else {
      await Model.findByIdAndUpdate(ctx.params.id, {
        title: ctx.request.body.title,
        content: ctx.request.body.content,
      });
      ctx.response.status = 200;
      ctx.body = `Note with title: "${ctx.request.body.title}" was updated`;
    }
  }
  next();
});

// todo: not working properly
router.delete("/notes/:id", async (ctx, next) => {
  try {
    await Model.findByIdAndRemove(ctx.params.id);
    ctx.response.status = 200;
    ctx.body = `Note with id ${ctx.params.id} was removed.`;
  } catch {
    ctx.response.status = 400;
    ctx.body = `Note with id ${ctx.params.id} does not exist.`;
  }
  next();
});

module.exports = router;
