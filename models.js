const mongoose = require("mongoose");

var Schema = mongoose.Schema;

const NoteSchema = new Schema({
  title: { type: String, required: [false, ""] },
  content: { type: String, required: [true, "content is required"] },
});

module.exports = mongoose.model("Note", NoteSchema);
