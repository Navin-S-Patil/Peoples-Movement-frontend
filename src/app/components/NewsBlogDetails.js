'use client'
import React, { useState, useEffect, Suspense } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { 
  Calendar, 
  User, 
  Clock, 
  ArrowLeft, 
  Share2,
  Facebook,
  Twitter,
  Linkedin,
  Copy,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { format, formatDistanceToNow } from 'date-fns';
import { 
  TooltipProvider,
} from "@/components/ui/tooltip"
import { showToast } from "@/lib/toast";
import useNewsBlogStore from '@/store/useNewsBlogStore';

const BlogDetailSkeleton = () => (
  <div className="space-y-6">
    <Skeleton className="h-8 w-3/4" />
    <div className="flex gap-4">
      <Skeleton className="h-6 w-32" />
      <Skeleton className="h-6 w-32" />
    </div>
    <Skeleton className="aspect-[21/9] w-full" />
    <div className="flex gap-2">
      {[1, 2, 3].map((i) => (
        <Skeleton key={i} className="h-6 w-16" />
      ))}
    </div>
    {[1, 2, 3, 4].map((i) => (
      <Skeleton key={i} className="h-4 w-full" />
    ))}
  </div>
);

const ImageGallery = ({ images, title, currentIndex, onNavigate }) => (
  <Card className="mb-8">
    <div className="relative aspect-[21/9] overflow-hidden">
      <Suspense fallback={<Skeleton className="w-full h-full" />}>
        <Image
          src={images[currentIndex]}
          alt={title}
          fill
          className="object-cover"
          priority
        />
      </Suspense>
      
      {images.length > 1 && (
        <>
          <Button
            variant="secondary"
            size="icon"
            className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70"
            onClick={() => onNavigate('prev')}
            aria-label="Previous image"
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button
            variant="secondary"
            size="icon"
            className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70"
            onClick={() => onNavigate('next')}
            aria-label="Next image"
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </>
      )}
    </div>
    <CardContent className="p-4 text-sm text-gray-500 text-center">
      {title}
    </CardContent>
  </Card>
);

const ShareButton = ({ title, onShare }) => (
  <div className="flex justify-end mb-6">
    <TooltipProvider>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" className="gap-2">
            <Share2 className="w-4 h-4" />
            Share
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem onClick={() => onShare('facebook')}>
            <Facebook className="w-4 h-4 mr-2" />
            Facebook
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => onShare('twitter')}>
            <Twitter className="w-4 h-4 mr-2" />
            Twitter
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => onShare('linkedin')}>
            <Linkedin className="w-4 h-4 mr-2" />
            LinkedIn
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => onShare('copy')}>
            <Copy className="w-4 h-4 mr-2" />
            Copy Link
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </TooltipProvider>
  </div>
);

const NewsBlogDetail = ({ newsId }) => {
  const { getBlogById } = useNewsBlogStore();
  const [blog, setBlog] = useState(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchBlog = () => {
      const blogData = getBlogById(newsId);
      setBlog(blogData);
      setIsLoading(false);
    };

    fetchBlog();
  }, [newsId, getBlogById]);

  if (isLoading || !blog) {
    return <BlogDetailSkeleton />;
  }

  const handleShare = async (platform) => {
    const url = window.location.href;
    const title = blog?.title;

    switch (platform) {
      case 'facebook':
        window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`, '_blank');
        break;
      case 'twitter':
        window.open(`https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title)}`, '_blank');
        break;
      case 'linkedin':
        window.open(`https://www.linkedin.com/shareArticle?mini=true&url=${encodeURIComponent(url)}&title=${encodeURIComponent(title)}`, '_blank');
        break;
      case 'copy':
        try {
          await navigator.clipboard.writeText(url);
          showToast.success("The article link has been copied to your clipboard.");
        } catch (err) {
          showToast.error("Could not copy the link to your clipboard.");
          console.error('Failed to copy:', err);
        }
        break;
    }
  };

  const handleImageNavigation = (direction) => {
    const allImages = [blog.coverImage, ...blog.images];
    if (direction === 'next') {
      setCurrentImageIndex((prev) => (prev + 1) % allImages.length);
    } else {
      setCurrentImageIndex((prev) => (prev - 1 + allImages.length) % allImages.length);
    }
  };

  const allImages = blog.coverImage ? [blog.coverImage, ...(blog.images || [])] : [];

  return (
    <article className="container mx-auto px-4 py-6 max-w-4xl">
      <Link href="/news" className="inline-flex items-center text-gray-600 hover:text-primary mb-6">
        <ArrowLeft className="w-4 h-4 mr-2" />
        Back to News
      </Link>

      <div className="mb-8">
        <h1 className="text-3xl md:text-4xl font-bold mb-4">
          {blog.title}
        </h1>
        
        <div className="flex flex-wrap items-center gap-4 text-gray-600 mb-4">
          <div className="flex items-center">
            <Calendar className="w-4 h-4 mr-2" />
            <span>{format(new Date(blog.publishDate), 'MMMM d, yyyy')}</span>
          </div>
          <div className="flex items-center">
            <User className="w-4 h-4 mr-2" />
            <span>{blog.author}</span>
          </div>
          <div className="flex items-center">
            <Clock className="w-4 h-4 mr-2" />
            <span>Updated {formatDistanceToNow(new Date(blog.lastUpdated), { addSuffix: true })}</span>
          </div>
        </div>

        <div className="flex flex-wrap gap-2 mb-6">
          {blog.tags?.map((tag, index) => (
            <Badge 
              key={index}
              variant="secondary"
              className="hover:bg-secondary/80"
            >
              {tag}
            </Badge>
          ))}
        </div>
      </div>

      {allImages.length > 0 && (
        <ImageGallery 
          images={allImages}
          title={blog.title}
          currentIndex={currentImageIndex}
          onNavigate={handleImageNavigation}
        />
      )}

      <ShareButton title={blog.title} onShare={handleShare} />

      <div 
        className="prose prose-lg max-w-none"
        dangerouslySetInnerHTML={{ __html: blog.content }}
      />
    </article>
  );
};

export default NewsBlogDetail;