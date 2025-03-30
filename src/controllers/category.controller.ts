import { Request, Response } from "express";
import Category from "../db/category";

export const createCategory = async (req: Request, res: Response) => {
  try {
    const { name, parent, status } = req.body;

    // Validate required fields
    if (!name || !status) {
      return res.status(400).json({ message: "Name and status are required." });
    }

    // Create a new category
    const newCategory = new Category({
      name,
      parent: parent || null,
      status
    });

    // Save the category to the database
    const savedCategory = await newCategory.save();

    res.status(201).json({
      message: "Category created successfully.",
      category: savedCategory
    });
  } catch (error) {
    console.error("Error creating category:", error);
    res.status(500).json({ message: "Internal server error." });
  }
};

export const updateCategory = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { name, status } = req.body;

    // Validate required fields
    if (!name || !status) {
      return res.status(400).json({ message: "Name and status are required." });
    }
    const updatedCategory = await Category.findByIdAndUpdate(
      id,
      { name, status },
      { new: true }
    );
    if (status === "inactive") {
      await Category.updateMany({ parent: id }, { status });
    }
    if (!updatedCategory) {
      return res.status(404).json({ message: "Category not found." });
    }
    res.status(200).json({
      message: "Category updated successfully.",
      category: updatedCategory
    });
  } catch (error) {
    console.error("Error updating category:", error);
    res.status(500).json({ message: "Internal server error." });
  }
};

export const deleteCategory = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    // Find the category to be deleted
    const categoryToDelete = await Category.findById(id);
    if (!categoryToDelete) {
      return res.status(404).json({ message: "Category not found." });
    }

    // Reassign child categories to null
    await Category.updateMany({ parent: id }, { parent: null });

    // Delete the category
    await Category.findByIdAndDelete(id);

    res.status(200).json({ message: "Category deleted successfully." });
  } catch (error) {
    console.error("Error while deleting category:", error);
    res.status(500).json({ message: "Internal server error." });
  }
};
export const getCategoryTree = async (req: Request, res: Response) => {
  try {
    const buildCategoryTree = async (parent: string | null = null) => {
      const categories = await Category.find({ parent }).lean();
      for (const category of categories) {
        (category as any).children = await buildCategoryTree(
          category._id as string
        );
      }
      return categories;
    };
    const tree = await buildCategoryTree();
    res.status(200).json(tree);
  } catch (error) {
    console.error("Error fetching category tree:", error);
    res.status(500).json({ message: "Internal server error." });
  }
};
