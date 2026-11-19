
import mongoose from "mongoose";

const ourPresencePageSchema = new mongoose.Schema(
  {
    key: {
      type: String,
      default: "our-presence",
      unique: true,
    },
    content: {
      type: mongoose.Schema.Types.Mixed,
      default: {},
    },
    published: {
      type: Boolean,
      default: true,
    },
    updatedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Admin",
      default: null,
    },
  },
  { timestamps: true }
);

export const OurPresencePage =
  mongoose.models.OurPresencePage ||
  mongoose.model("OurPresencePage", ourPresencePageSchema);
