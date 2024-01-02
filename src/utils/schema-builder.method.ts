import { Schema } from "mongoose";
export const schemaBuilder = (baseSchema: Record<string, unknown>): Schema => {
  return new Schema(
    {
      ...baseSchema,
      createdBy: { type: Schema.Types.ObjectId, ref: "User" },
      updatedBy: { type: Schema.Types.ObjectId, ref: "User" },
    },
    { versionKey: false, timestamps: true }
  );
  // .plugin(uniqueValidator)
};
