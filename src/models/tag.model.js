import mongoose from "mongoose";
import { Schema } from "mongoose";

const tagSchema = new Schema({
  name: {
    type: String,
    require: true,
    maxlength: 30,
    index: true,
    unique: true
  },
  numOfUses: {
    type: Number,
    min: 0,
    default: 0
  },
}, { timeseries: false });
const Tags = mongoose.model("Tag", tagSchema);
export default Tags;
