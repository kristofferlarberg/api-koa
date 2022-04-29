const Koa = require("koa");
const body = require("koa-body");
const Router = require("koa-router");

let notes = [
  {
    id: 1,
    content:
      "Lorem ipsum dolor sit amet. Qui galisum rerum sed tempora rerum et rerum cupiditate a dolorem corporis a aliquid obcaecati id amet dignissimos. Et quaerat molestiae est ipsa quia qui omnis quis rem laudantium ullam quo autem fuga non quia excepturi! Est Quis doloremque et ullam Quis in quidem asperiores qui tenetur voluptas et laborum mollitia aut exercitationem perspiciatis. Et sunt quas sed corporis quis sed dolore recusandae est enim rerum.",
  },
  {
    id: 2,
    content:
      "Lorem ipsum dolor sit amet. Id quibusdam deserunt est voluptatibus soluta est molestiae culpa et quis adipisci eos eius illum sit placeat aliquam nam beatae deleniti. Aut excepturi numquam hic nemo iure est cumque perferendis et illum nisi non nulla consequatur non totam sunt! Eum voluptatibus atque aut pariatur voluptatum ut officia consequatur. Ut eligendi ipsa in dolorem neque sit consequatur dolor?",
  },
  {
    id: 3,
    content:
      "Est facere itaque et esse officiis ut rerum quia. Ut consequatur quia ad dolorum iste vel mollitia inventore et aperiam aspernatur. Aut enim consequatur 33 numquam nemo id veniam fugit et necessitatibus mollitia? Qui amet ipsa et reiciendis assumenda id quam placeat qui velit officiis.",
  },
  {
    id: 4,
    content:
      "Lorem ipsum dolor sit amet. Et mollitia error At quas molestiae eos repellat doloremque non reprehenderit placeat. Rem aspernatur molestiae id nihil autem ut obcaecati facere aut natus dicta aut voluptatibus vero qui voluptatem quia aut facilis velit? Sit sequi nisi aut voluptas sint a velit officiis. Aut magni dolore aut atque reiciendis sit repellat excepturi ut nemo odio 33 quam illum?",
  },
  {
    id: 5,
    content:
      "Lorem ipsum dolor sit amet. Eos sunt laudantium et esse optio ut magni omnis et exercitationem excepturi ut omnis deleniti consectetur nemo eos quasi ratione. Et dolorem beatae et itaque sunt ad tempore totam eum repellat perspiciatis et numquam quis in mollitia nihil. Eum itaque iusto est aperiam voluptas eum laboriosam fugiat eos autem molestiae. Est tenetur officiis quo optio eveniet non necessitatibus optio in officiis quos ut ipsum consequatur et ullam molestiae.",
  },
];

const app = new Koa();
app.use(body());

// setup routes
const router = new Router();

router.get("/", (ctx, next) => {
  ctx.body = "Hello world";
  next();
});

router.get("/notes", (ctx, next) => {
  ctx.body = notes;
  next();
});

router.get("/notes/:id", (ctx, next) => {
  let getCurrentNote = notes.filter((note) => {
    if (note.id == ctx.params.id) {
      return true;
    }
  });
  if (getCurrentNote.length) {
    ctx.body = getCurrentNote[0];
  } else {
    ctx.response.status = 404;
    ctx.body = "Note not found;";
  }
  next();
});

router.post("/notes", (ctx, next) => {
  if (!ctx.request.body.id || !ctx.request.body.content) {
    ctx.response.status = 400;
    ctx.body = "Please enter the data";
  } else if (notes.find((note) => note.id == ctx.request.body.id)) {
    ctx.response.status = 400;
    ctx.body = "The id already exists, please enter another one.";
  } else {
    notes.push({
      id: ctx.request.body.id,
      content: ctx.request.body.content,
    });
    ctx.response.status = 201;
    ctx.body = `New note added with id: ${ctx.request.body.id}`;
  }
  next();
});

// creating an object with curl:
// curl -X POST --data "id={id}&content={content}" http://localhost:3000/notes

router.put("/notes/:id", (ctx, next) => {
  if (!ctx.params.id || !ctx.request.body.content) {
    ctx.response.status = 400;
    ctx.body = "Please enter the data";
  } else {
    var updateIndex = notes
      .map((note) => {
        return note.id;
      })
      .indexOf(parseInt(ctx.params.id));
    if (updateIndex === -1) {
      notes.push({
        id: parseInt(ctx.params.id, 10),
        content: ctx.request.body.content,
      });
      ctx.response.status = 201;
      ctx.body = `New note added with id: ${ctx.params.id}`;
    } else {
      notes[updateIndex] = {
        id: parseInt(ctx.params.id, 10),
        content: ctx.request.body.content,
      };
      ctx.response.status = 201;
      ctx.body = `Note with id: ${ctx.params.id} was updated`;
    }
  }
  next();
});

// updating an object with curl:
// curl -X PUT --data "id={id}&content={content}" http://localhost:3000/notes

router.delete("/notes/:id", (ctx, next) => {
  const removeIndex = notes
    .map((note) => note.id)
    .indexOf(parseInt(ctx.params.id, 10));
  if (removeIndex === -1) {
    ctx.response.status = 400;
    ctx.body = `The id does not exist, please enter another one. ${ctx.params.id}`;
  } else {
    ctx.response.status = 201;
    notes.splice(removeIndex, 1);
    ctx.body = `note with id: ${ctx.params.id} was removed`;
  }
  next();
});

// deleting an object with curl:
// curl -X DELETE --data http://localhost:3000/notes/remove/{id}

// invoke routes
app.use(router.routes());

app.listen(3000);
