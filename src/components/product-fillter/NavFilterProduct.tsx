"use client";

import { SideBarAttributeCheckbox } from "@/components/product-fillter/SideBarAttributeCheckbox";
import { SideBarCheckbox } from "@/components/product-fillter/SideBarCheckbox";
import { SliderFilterProduct } from "@/components/product-fillter/SliderFilterProduct";
import { AttributesResType } from "@/schemaValidations/attributes.schema";
import { CategoriesResType } from "@/schemaValidations/categories.schema";
import { useState } from "react";
import { FaChevronDown, FaChevronUp } from "react-icons/fa";
import { motion } from "framer-motion";

interface ProductsFilterProps {
  refetchProducts: () => void;
  categoriesList: CategoriesResType[];
}

export default function NavFilterProduct({
  refetchProducts,
  categoriesList,
}: ProductsFilterProps) {
  const [isOpenCategory, setIsOpenCategory] = useState(true);
  const [isOpenPrice, setIsOpenPrice] = useState(true);

  return (
    <div className="w-full bg-white shadow-lg rounded-lg p-6">
      {/* Chọn danh mục */}
      <div>
        <div
          className="w-full cursor-pointer flex justify-between items-center transition-transform duration-200"
          onClick={() => setIsOpenCategory(!isOpenCategory)}
        >
          <h3 className="font-semibold mb-2">Chọn danh mục:</h3>
          {isOpenCategory ? (
            <FaChevronDown size={10} />
          ) : (
            <FaChevronUp size={10} />
          )}
        </div>
        <motion.ul
          initial={{ opacity: 0, maxHeight: 0 }}
          animate={{
            opacity: isOpenCategory ? 1 : 0,
            maxHeight: isOpenCategory ? 1000 : 0,
          }}
          transition={{ duration: 0.4, ease: "easeInOut" }}
          className="overflow-hidden"
        >
          {categoriesList.map((category) => (
            <li className="mt-2" key={category.id}>
              <SideBarCheckbox
                category={category}
                refetchProducts={refetchProducts}
              />
            </li>
          ))}
        </motion.ul>
      </div>

      <hr className="mt-5" />

      {/* Lọc theo giá */}
      <div className="mt-4">
        <h3 className="font-semibold mb-2">Lọc theo:</h3>
        <div className="mt-4">
          <div
            className="w-full cursor-pointer flex justify-between items-center transition-transform duration-200"
            onClick={() => setIsOpenPrice(!isOpenPrice)}
          >
            <h5 className="mb-2">Giá cả:</h5>
            {isOpenPrice ? (
              <FaChevronDown size={10} />
            ) : (
              <FaChevronUp size={10} />
            )}
          </div>
          <motion.div
            initial={{ opacity: 0, maxHeight: 0 }}
            animate={{
              opacity: isOpenPrice ? 1 : 0,
              maxHeight: isOpenPrice ? 100 : 0,
            }}
            transition={{ duration: 0.4, ease: "easeInOut" }}
            className="overflow-hidden"
          >
            <SliderFilterProduct refetchProducts={refetchProducts} />
          </motion.div>
        </div>
      </div>

      {/* Lọc theo thuộc tính */}
      {/* <div className="mt-4">
        <div
          className="w-full cursor-pointer flex justify-between items-center transition-transform duration-200"
          onClick={() => setIsOpenAttribute(!isOpenAttribute)}
        >
          <h5 className="mb-2">Thuộc tính liên quan:</h5>
          {isOpenAttribute ? (
            <FaChevronDown size={10} />
          ) : (
            <FaChevronUp size={10} />
          )}
        </div>
        <motion.ul
          initial={{ opacity: 0, maxHeight: 0 }}
          animate={{
            opacity: isOpenAttribute ? 1 : 0,
            maxHeight: isOpenAttribute ? 200 : 0,
          }}
          transition={{ duration: 0.4, ease: "easeInOut" }}
          className="overflow-hidden"
        >
          {attributesList.map((attribute, index) => (
            <li className="mt-2" key={index}>
              <SideBarAttributeCheckbox
                attribute={attribute}
                refetchProducts={refetchProducts}
                keyUnique={index}
              />
            </li>
          ))}
        </motion.ul>
      </div> */}
    </div>
  );
}
