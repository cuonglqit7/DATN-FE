"use client";

import { Button } from "@/components/ui/button";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
} from "@/components/ui/pagination";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { parseAsInteger, useQueryState } from "nuqs";

interface ProductsFilterProps {
  refetchProducts: () => void;
  totalPages: number;
}

export function PaginationDemo({
  refetchProducts,
  totalPages,
}: ProductsFilterProps) {
  const [page, setPage] = useQueryState("page", parseAsInteger.withDefault(1));

  if (page > totalPages) {
    setPage(1);
  }

  const handlePageChage = (value: number) => {
    if (value < 1 || value > totalPages) return;
    setPage(value);
    setTimeout(() => {
      refetchProducts();
    }, 250);
  };

  return (
    <div className="mt-4 flex justify-center">
      <Pagination>
        <PaginationContent>
          {page > 1 && (
            <PaginationItem>
              <Button
                variant="outline"
                onClick={() => handlePageChage(page - 1)}
                className="cursor-pointer"
              >
                <ChevronLeft className="size-4" />
                Trang trước
              </Button>
            </PaginationItem>
          )}

          {totalPages > 3 && page > 3 && <PaginationEllipsis />}

          {page > 1 && (
            <>
              <PaginationItem>
                <Button
                  variant="outline"
                  onClick={() => handlePageChage(page - 1)}
                  className="cursor-pointer"
                >
                  {page - 1}
                </Button>
              </PaginationItem>
            </>
          )}

          <PaginationItem>
            <Button variant="outline" disabled>
              {page}
            </Button>
          </PaginationItem>

          {page < totalPages && (
            <>
              <PaginationItem>
                <Button
                  variant="outline"
                  onClick={() => handlePageChage(page + 1)}
                  className="cursor-pointer"
                >
                  {page + 1}
                </Button>
              </PaginationItem>
            </>
          )}

          {totalPages > 3 && page < totalPages - 2 && <PaginationEllipsis />}

          {page < totalPages && (
            <PaginationItem>
              <Button
                variant="outline"
                onClick={() => handlePageChage(page + 1)}
                className="cursor-pointer"
              >
                Trang tiếp theo
                <ChevronRight className="size-4" />
              </Button>
            </PaginationItem>
          )}
        </PaginationContent>
      </Pagination>
    </div>
  );
}
