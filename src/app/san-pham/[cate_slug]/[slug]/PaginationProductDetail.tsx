"use client";

import { Button } from "@/components/ui/button";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
} from "@/components/ui/pagination";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { parseAsInteger, useQueryState } from "nuqs";
import { useEffect } from "react";

interface PaginationProductDetailProps {
  refetchProducts: () => void;
  totalPages: number;
}

export function PaginationProductDetail({
  refetchProducts,
  totalPages,
}: PaginationProductDetailProps) {
  const [page, setPage] = useQueryState(
    "page_ralated",
    parseAsInteger.withDefault(1)
  );

  useEffect(() => {
    if (page > totalPages && totalPages > 0) {
      setPage(1);
    }
  }, [page, totalPages, setPage]);

  const handlePageChange = (value: number) => {
    if (value < 1 || value > totalPages) return;
    setPage(value);
    setTimeout(() => {
      refetchProducts();
    }, 100);
  };

  return (
    <Pagination className="justify-end mb-2">
      <PaginationContent>
        <PaginationItem>
          <Button
            variant={"outline"}
            className="cursor-pointer"
            onClick={() => handlePageChange(page - 1)}
            disabled={page === 1}
          >
            <ChevronLeft className="size-4" />
          </Button>
        </PaginationItem>

        <PaginationItem>
          <Button
            variant={"outline"}
            className="cursor-pointer"
            onClick={() => handlePageChange(page + 1)}
            disabled={page === totalPages}
          >
            <ChevronRight className="size-4" />
          </Button>
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
}
