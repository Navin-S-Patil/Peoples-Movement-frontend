"use client";

import React, { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  Calendar,
  Eye,
  ChevronLeft,
  ChevronRight,
  Loader2,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import { Skeleton } from "@/components/ui/skeleton";
import { useFetchPDFMetadata } from "@/hooks/useFetchPDFMetadata";

import usePdfStore from "@/store/usePdfStore";

// Loading skeleton for newspaper card
const NewspaperCardSkeleton = () => (
  <Card className="overflow-hidden">
    <div className="space-y-3">
      <Skeleton className="aspect-[3/2] w-full" />
      <CardContent className="p-4">
        <Skeleton className="h-6 w-3/4 mb-3" />
        <Skeleton className="h-4 w-1/2 mb-4" />
        <Skeleton className="h-10 w-full" />
      </CardContent>
    </div>
  </Card>
);

const NewsPaperList = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 9;
  const { setPdfMetadata } = usePdfStore();

  // Get initial data from store
  const { pdfMetadata: initialData } = usePdfStore();
  // console.log("initialData", initialData);

  const {
    data: newspapers,
    isLoading,
    error,
  } = useFetchPDFMetadata({
    initialData,
    enabled: !initialData || !Array.isArray(initialData),
  });

  // Handle state updates in useEffect
  useEffect(() => {
    const validData =
      newspapers && Array.isArray(newspapers) ? newspapers : null;
    const validInitialData =
      initialData && Array.isArray(initialData) ? initialData : null;

    if (validInitialData && !isLoading) {
      setPdfMetadata(validInitialData);
    } else if (validData && !isLoading) {
      setPdfMetadata(validData);
    }
  }, [initialData, newspapers, isLoading, setPdfMetadata]);

  // Get the data to display - either from initialData or newspapers
  const displayData = Array.isArray(newspapers)
    ? newspapers
    : Array.isArray(initialData)
    ? initialData
    : [];

  // Calculate total pages
  const totalItems = displayData.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);

  // Get current items
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = displayData.slice(indexOfFirstItem, indexOfLastItem);

  // Change page
  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Generate page numbers array
  const getPageNumbers = () => {
    const pageNumbers = [];
    const maxVisiblePages = 5;

    if (totalPages <= maxVisiblePages) {
      for (let i = 1; i <= totalPages; i++) {
        pageNumbers.push(i);
      }
    } else {
      let startPage = Math.max(1, currentPage - 2);
      let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

      if (endPage === totalPages) {
        startPage = Math.max(1, endPage - maxVisiblePages + 1);
      }

      for (let i = startPage; i <= endPage; i++) {
        pageNumbers.push(i);
      }
    }

    return pageNumbers;
  };

  // Loading state with loader
  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-6 flex justify-center items-center">
        <Loader2 className="animate-spin h-10 w-10 text-gray-600" />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold">News Archives</h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {currentItems.map((paper) => (
          <Card
            key={paper.pdfId}
            className="overflow-hidden transition-all duration-300 hover:shadow-lg"
          >
            <Link href={`/e-paper/${paper.pdfId}`}>
              <div className="cursor-pointer">
                <div className="relative aspect-[3/2] overflow-hidden">
                  <Suspense fallback={<Skeleton className="w-full h-full" />}>
                    <Image
                      src={paper.thumbnailUrl}
                      alt={`${paper.name} thumbnail`}
                      fill
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      loading="lazy"
                      // // Add priority to first image only
                      // priority={indexOfFirstItem === 0}
                      className="object-cover transform transition-transform duration-300 hover:scale-105"
                    />
                  </Suspense>
                </div>

                <CardContent className="p-4">
                  <h2 className="text-xl font-semibold mb-3 line-clamp-2">
                    {paper.name}
                  </h2>

                  <div className="flex items-center text-gray-500 mb-4">
                    <Calendar className="w-4 h-4 mr-2" />
                    <span className="text-sm">
                      {format(new Date(paper.date), "MMMM d, yyyy")}
                    </span>
                  </div>

                  <Button
                    variant="outline"
                    className="w-full group hover:bg-primary hover:text-primary-foreground"
                  >
                    <Eye className="w-4 h-4 mr-2 group-hover:animate-pulse" />
                    Read E-Paper
                  </Button>
                </CardContent>
              </div>
            </Link>
          </Card>
        ))}
      </div>

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="mt-8 flex justify-center items-center gap-2">
          <Button
            variant="outline"
            size="icon"
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>

          {getPageNumbers().map((pageNumber) => (
            <Button
              key={pageNumber}
              variant={currentPage === pageNumber ? "default" : "outline"}
              onClick={() => handlePageChange(pageNumber)}
              className="w-10 h-10"
            >
              {pageNumber}
            </Button>
          ))}

          <Button
            variant="outline"
            size="icon"
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      )}

      {/* Items per page indicator */}
      <div className="mt-4 text-center text-sm text-gray-500">
        Showing {indexOfFirstItem + 1}-{Math.min(indexOfLastItem, totalItems)}{" "}
        of {totalItems} items
      </div>
    </div>
  );
};

export default NewsPaperList;
