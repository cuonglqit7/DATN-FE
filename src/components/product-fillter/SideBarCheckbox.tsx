"use client";

import { Checkbox } from "@/components/ui/checkbox";
import { CategoriesResType } from "@/schemaValidations/categories.schema";
import { parseAsArrayOf, parseAsInteger, useQueryState } from "nuqs";

interface CategoryProps {
  category: CategoriesResType;
  refetchProducts: () => void;
}

export function SideBarCheckbox({ category, refetchProducts }: CategoryProps) {
  const [categories, setCategories] = useQueryState(
    "category_id",
    parseAsArrayOf(parseAsInteger).withDefault([])
  );

  const selectedCategories =
    Array.isArray(categories) && categories !== null ? categories : [];

  const handleCategoryChange = async (categoryId: number, checked: boolean) => {
    try {
      const updatedCategories = checked
        ? [...new Set([...selectedCategories, categoryId])]
        : selectedCategories.filter((id) => id !== categoryId);

      if (
        JSON.stringify(updatedCategories) !== JSON.stringify(selectedCategories)
      ) {
        await setCategories(
          updatedCategories.length > 0 ? updatedCategories : null
        );
        setTimeout(() => {
          refetchProducts();
        }, 100);
      }
    } catch (error) {
      console.error("Error updating categories:", error);
    }
  };

  return (
    <div className="flex items-center space-x-2">
      <Checkbox
        id={`category-${category.id}`}
        className="w-6 h-6 cursor-pointer"
        checked={selectedCategories.includes(Number(category.id))}
        onCheckedChange={(checked) =>
          handleCategoryChange(Number(category.id), checked as boolean)
        }
      />
      <label
        htmlFor={`category-${category.id}`}
        className="text-md font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
      >
        {category.category_name}
      </label>
    </div>
  );
}
