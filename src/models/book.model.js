import mongoose, { Schema } from "mongoose";

const BookSchema = new Schema({
  title: {
    type: String,
    required: true,
    index: true,
    unique: true,
  },
  tags: [{
    type: mongoose.Types.ObjectId,
    ref: "Tag",
  }],
  author: {
    type: mongoose.Types.ObjectId,
    ref: 'Uesr',
    required: true,
  },
  file: {
    type: String,
    required: true,
  },
  coverImage: {
    type: String,
    required: true,
  },
  ranking: {
    types: Number,
  },
  numOfSales: {
    types: Number,
  },
  avgRating: {
    types: Number,
  },
  description: {
    type: String,
    default: ""
  },
  price: {
    type: Number,
    default: 0,
  },
  totalReviews: {
    type: Number,
    default: 0,
  },
}, {
  timeseries: true
});

BookSchema.pre("save", async function(next) {
  if (this.isModified(this.tags)) {
    this.tags = [...new Set(this.tags)]
  }
  return next();
});
const Book = mongoose.model('Book', BookSchema);
export default Book;
