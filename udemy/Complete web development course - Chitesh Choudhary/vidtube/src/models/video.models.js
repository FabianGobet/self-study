// video [icon: video] {
//   _id string pk
//   owner ObjectId user
//   videoFile string
//   thumbnail string
//   title string
//   description string
//   duration number
//   views number
//   isPublished boolean
//   createdAt Date
//   updatedAt Date
// }

import mongoose, { Schema } from "mongoose";
import mongooseAggregatePaginate from "mongoose-aggregate-paginate-v2";

const videoSchema = new Schema(
  {
    owner: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true
    },
    videoFile: {
      type: String,
      required: true
    },
    thumbnail: {
      type: String,
      required: true
    },
    title: {
      type: String,
      required: true
    },
    description: {
      type: String,
      required: true
    },
    views: {
      type: Number,
      default: 0
    },
    duration: {
      type: Number,
      required: true
    },
    isPublished: {
      type: Boolean,
      default: true
    }
  },
  {
    timestamps: true
  }
);

videoSchema.plugin(mongooseAggregatePaginate);

export const Video = mongoose.model("Video", videoSchema);
