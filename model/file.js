const mongoose = require("mongoose");

const userFileSchema = mongoose.Schema({
  filename: {
    type: String,
    required: true,
  },
  path: {
    type: String,
    required: true,
  },
  size: {
    type: Number,
    required: true,
  },
  uuid: {
    type: String,
    required: true,
  },
 
},{timestamps:true});
const File = mongoose.model("File", userFileSchema);
module.exports = File;