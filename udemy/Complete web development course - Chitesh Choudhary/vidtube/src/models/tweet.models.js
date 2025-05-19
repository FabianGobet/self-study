// tweet [icon: twitter] {
//   _id string pk
//   owner ObjectId user
//   content string
//   createdAt Date
//   updatedAt Date
// }

import mongoose, { Schema } from "mongoose";

const tweetSchema = new Schema(
  {
    owner: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true
    },
    content: {
      type: String,
      required: true,
      trim: true
    }
  },
  {
    timestamps: true
  }
);

export const Tweet = mongoose.model("Tweet", tweetSchema);
