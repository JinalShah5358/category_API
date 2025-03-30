import { Schema, model, Document } from "mongoose";

export interface ICategory extends Document {
  name: string;
  parent?: string;
  status: "active" | "inactive";
}

const CategorySchema = new Schema<ICategory>(
  {
    name: { type: String, required: true },
    parent: { type: String, default: null },
    status: { type: String, required: true }
  },
  {
    timestamps: true
  }
);

const Category = model<ICategory>("Category", CategorySchema);

export default Category;
