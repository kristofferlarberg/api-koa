const Router = require("koa-router");
const Model = require("./models");

const router = new Router();

router.get("/", (ctx, next) => {
  ctx.body = "Hello world";
  next();
});

router.get("/notes", async (ctx, next) => {
  try {
    const notes = await Model.find();
    ctx.body = notes;
  } catch (error) {
    ctx.response.status = 500;
    ctx.body = `${error}`;
  }
  next();
});

router.get("/notes/:id", async (ctx, next) => {
  try {
    ctx.body = await Model.find({ _id: ctx.params.id });
    ctx.response.status = 200;
  } catch {
    ctx.response.status = 400;
    ctx.body = `Note with id ${ctx.params.id} was not found`;
  }
  next();
});

router.post("/notes", async (ctx, next) => {
  try {
    const note = new Model({
      title: ctx.request.body.title,
      content: ctx.request.body.content,
    });
    await note.save();
    ctx.response.status = 201;
    ctx.body = `New note added with title: ${ctx.request.body.title}`;
  } catch (error) {
    if (!ctx.request.body.title || !ctx.request.body.content) {
      ctx.response.status = 400;
      ctx.body = "Please enter the data";
    } else {
      ctx.response.status = 500;
      ctx.body = `${error}`;
    }
  }
  next();
});

router.put("/notes/:id", async (ctx, next) => {
  try {
    if (ctx.request.body.title && ctx.request.body.content) {
      await Model.findByIdAndUpdate(ctx.params.id, {
        title: ctx.request.body.title,
        content: ctx.request.body.content,
      });
      ctx.response.status = 200;
      ctx.body = `Note with title: "${ctx.request.body.title}" was updated`;
    } else {
      throw new Error("Data is missing");
    }
  } catch (error) {
    if (error.message === "Data is missing") {
      ctx.response.status = 400;
      ctx.body = "Please enter data";
    } else {
      ctx.response.status = 400;
      ctx.body = `Note with id ${ctx.params.id} was not found`;
    }
  }
  next();
});

router.delete("/notes/:id", async (ctx, next) => {
  try {
    const existingNote = await Model.find({ _id: ctx.params.id });
    // todo: exists because findByIdAndDelete runs even if element has beendeleted
    if (existingNote.length > 0) {
      // todo: why is findByIdAndDelete running even if element has been deleted?
      await Model.deleteOne({ _id: ctx.params.id });
      ctx.body = `Note with id ${ctx.params.id} was removed.`;
    } else {
      throw new Error("Not found");
    }
  } catch (error) {
    if (error.message === "Not found") {
      ctx.body = `Note with id ${ctx.params.id} was not found`;
    } else {
      ctx.body = `${error}`;
    }
  }
  next();
});

module.exports = router;
