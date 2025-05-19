// subscription [icon: money] {
//   _id string pk
//   subscriber ObjectId user
//   channel ObjectId user
//   createdAt Date
//   updatedAt Date
// }

import mongoose, { Schema } from "mongoose";

const subscriptionSchema = new Schema(
  {
    subscriber: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true
    },
    channel: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true
    }
  },
  {
    timestamps: true
  }
);

export const Subscription = mongoose.model("Subscription", subscriptionSchema);
