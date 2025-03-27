"use client";

import { cn } from "@/lib/utils";
import { Slider } from "@/components/ui/slider";
import { useState } from "react";
import { formatPrice } from "@/components/format-price/format-price";
import { parseAsInteger, useQueryState } from "nuqs";

type SliderProps = React.ComponentProps<typeof Slider> & {
  onFilterChange?: (min: number, max: number) => void;
  refetchProducts: () => void;
};

export function SliderFilterProduct({
  refetchProducts,
  className,
  onFilterChange,
  ...props
}: SliderProps) {
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 10000000]);
  const [minPrice, setMinPrice] = useQueryState(
    "minPrice",
    parseAsInteger.withDefault(0)
  );
  const [maxPrice, setMaxPrice] = useQueryState(
    "maxPrice",
    parseAsInteger.withDefault(10000000)
  );

  const handleValueChange = (value: number[]) => {
    if (value.length === 2) {
      const newRange: [number, number] = [value[0], value[1]];
      setMinPrice(newRange[0]);
      setMaxPrice(newRange[1]);
      setPriceRange(newRange);
      if (onFilterChange) {
        onFilterChange(newRange[0], newRange[1]);
      }
      setTimeout(() => {
        refetchProducts();
      }, 100);
    }
  };

  return (
    <div className="mt-2">
      <Slider
        defaultValue={[0, 10000000]}
        max={10000000}
        min={0}
        step={100000}
        value={priceRange}
        onValueChange={handleValueChange}
        className={cn("w-[100%] cursor-pointer", className)}
        {...props}
      />
      <div className="flex justify-between mt-2">
        <p>{formatPrice(priceRange[0])}</p>
        <p>{formatPrice(priceRange[1])}</p>
      </div>
    </div>
  );
}
