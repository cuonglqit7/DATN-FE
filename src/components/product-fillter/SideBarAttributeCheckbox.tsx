"use client";

import { Checkbox } from "@/components/ui/checkbox";
import { AttributesResType } from "@/schemaValidations/attributes.schema";

interface CategoryProps {
  attribute: AttributesResType;
  keyUnique: number;
}

export function SideBarAttributeCheckbox({
  attribute,
  keyUnique,
}: CategoryProps) {
  return (
    <div className="flex items-center space-x-2">
      <Checkbox
        id={`attribute-${keyUnique}`}
        className="w-6 h-6 cursor-pointer"
      />
      <label
        htmlFor={`attribute-${keyUnique}`}
        className="text-md font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
      >
        {attribute.attribute_name} - {attribute.attribute_value}
      </label>
    </div>
  );
}
