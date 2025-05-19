// like [icon: thumbs-up] {
//   _id string pk
//   video ObjectId video
//   comment ObjectId comment
//   tweet ObjectId tweet
//   likedBy ObjectId user
//   createdAt Date
//   updatedAt Date
// }

import mongoose, { Schema } from "mongoose";

const likeSchema = new Schema(
  {
    video: {
      type: Schema.Types.ObjectId,
      ref: "Video",
      required: true
    },
    comment: {
      type: Schema.Types.ObjectId,
      ref: "Comment"
    },
    tweet: {
      type: Schema.Types.ObjectId,
      ref: "Tweet"
    },
    likeBy: {
      type: Schema.Types.ObjectId,
      ref: "User"
    }
  },
  {
    timestamps: true
  }
);

export const Like = mongoose.model("Like", likeSchema);
