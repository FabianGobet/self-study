// playlist [icon: library] {
//   _id string pk
//   owner ObjectId user
//   videos ObjectId[] video
//   name string
//   description string
//   createdAt Date
//   updatedAt Date
// }

import mongoose, { Schema } from "mongoose";

const playlistSchema = new Schema(
  {
    owner: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true
    },
    videos: {
      type: [
        {
          type: Schema.Types.ObjectId,
          ref: "Video"
        }
      ] // default is empty list
    },
    name: {
      type: String,
      required: true
    },
    description: {
      type: String
    }
  },
  {
    timestamps: true
  }
);

playlistSchema.index({ owner: 1, name: 1 }, { unique: true });

export const Playlist = mongoose.model("Playlist", playlistSchema);
