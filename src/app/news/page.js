"use client";
import React, { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import Image from "next/image";
import { Calendar, User, ChevronLeft, ChevronRight, Clock } from "lucide-react";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { format, formatDistanceToNow } from "date-fns";
import useNewsBlogStore from "@/store/useNewsBlogStore";
import { useFetchNewsBlog } from "@/hooks/useFetchNewsBlog"; // Assume a custom hook exists for fetching

// Loading skeleton for blog card
const BlogCardSkeleton = () => (
  <Card className="overflow-hidden">
    <div className="space-y-3">
      <Skeleton className="aspect-video w-full" />
      <CardContent className="p-4">
        <Skeleton className="h-4 w-20 mb-2" /> {/* Date */}
        <Skeleton className="h-6 w-3/4 mb-2" /> {/* Title */}
        <Skeleton className="h-4 w-full mb-2" /> {/* Summary line 1 */}
        <Skeleton className="h-4 w-2/3 mb-4" /> {/* Summary line 2 */}
        <div className="flex gap-2">
          <Skeleton className="h-6 w-16" /> {/* Tag */}
          <Skeleton className="h-6 w-16" /> {/* Tag */}
        </div>
      </CardContent>
    </div>
  </Card>
);

const NewsBlogList = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [blogs, setBlogs] = useState([]);
  const itemsPerPage = 9;

  const { newsBlogData: initialData, setNewsBlogData } = useNewsBlogStore();
  const { data, isLoading, error } = useFetchNewsBlog({
    initialData,
    enabled: !initialData || !Array.isArray(initialData),
  });

  // Sync fetched data or initial data to the store and component state
  useEffect(() => {
    const validData = data && Array.isArray(data) ? data : null;
    const validInitialData =
      initialData && Array.isArray(initialData) ? initialData : null;

    if (validInitialData) {
      setNewsBlogData(validInitialData);
      setBlogs(validInitialData);
    } else if (validData) {
      setNewsBlogData(validData);
      setBlogs(validData);
    }
  }, [initialData, data, setNewsBlogData]);

  // Calculate total pages
  const totalItems = blogs.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);

  // Get current items
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = blogs.slice(indexOfFirstItem, indexOfLastItem);

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

  // Loading state
  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-6">
        <div className="flex justify-between items-center mb-8">
          <Skeleton className="h-8 w-48" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(itemsPerPage)].map((_, index) => (
            <BlogCardSkeleton key={index} />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold">Latest News</h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {currentItems.map((blog) => (
          <Card
            key={blog.newsId}
            className="overflow-hidden transition-all duration-300 hover:shadow-lg"
          >
            <Link href={`/news/${blog.newsId}`} >
              <div className="cursor-pointer">
                <div className="relative aspect-video overflow-hidden">
                  <Suspense fallback={<Skeleton className="w-full h-full" />}>
                    <Image
                      src={blog.coverImage}
                      alt={blog.title}
                      fill
                      loading="lazy"
                      className="object-cover transform transition-transform duration-300 hover:scale-105"
                    />
                  </Suspense>
                </div>

                <CardContent className="p-4">
                  <div className="flex items-center gap-4 text-sm text-gray-500 mb-3">
                    <div className="flex items-center">
                      <Calendar className="w-4 h-4 mr-1" />
                      <span>
                        {format(new Date(blog.publishDate), "MMM d, yyyy")}
                      </span>
                    </div>
                    <div className="flex items-center">
                      <User className="w-4 h-4 mr-1" />
                      <span>{blog.author}</span>
                    </div>
                  </div>

                  <h2 className="text-xl font-semibold mb-3 line-clamp-2 hover:text-primary transition-colors">
                    {blog.title}
                  </h2>

                  <p className="text-gray-600 mb-4 line-clamp-3">
                    {blog.summary}
                  </p>

                  <div className="flex flex-wrap gap-2 mb-4">
                    {blog.tags.map((tag, index) => (
                      <Badge
                        key={index}
                        variant="secondary"
                        className="hover:bg-secondary/80"
                      >
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </CardContent>

                <CardFooter className="px-4 py-3 border-t flex justify-between items-center">
                  <div className="flex items-center text-sm text-gray-500">
                    <Clock className="w-4 h-4 mr-1" />
                    <span>
                      Updated{" "}
                      {formatDistanceToNow(new Date(blog.lastUpdated), {
                        addSuffix: true,
                      })}
                    </span>
                  </div>
                  <Button variant="ghost" className="hover:text-primary">
                    Read More →
                  </Button>
                </CardFooter>
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

export default NewsBlogList;
