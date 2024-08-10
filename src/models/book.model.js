import mongoose, { Schema } from "mongoose";

const BookSchema = new Schema({
  name: {
    type: String,
    required: true,
    index: true
  },
  tags: [{
    type: String,
  }],
  author: {
    type: mongoose.Types.ObjectId,
    ref: 'Author',
    required: true,
  },
  coverImage: {
    type: String,
    required: true,
  },
  likes: {
    type: Number,
    default: 0,
  },
  totalReviews: {
    types: Number,
    default: 0
  },
  description: {
    type: String,
    default: ""
  },
  price: {
    type: Number,
    default: 0,
  },
}, {
  timeseries: true
});

const Book = mongoose.model('Book', BookSchema);
export default Book;
