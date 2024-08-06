import mongoose, { Schema } from "mongoose";

const ReviewSchema = new Schema({
  comment: {
    type: String,
    default: ""
  },
  user: {
    type: mongoose.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  to: {
    type: mongoose.Types.ObjectId,
    ref: 'User',
    required: true,
  },
}, {
  timeseries: true
});

const Review = mongoose.model('Review', ReviewSchema);
export default Review;
