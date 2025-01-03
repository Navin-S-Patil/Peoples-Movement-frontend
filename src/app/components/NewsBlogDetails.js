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
          <DropdownMenuItem onClick={() => onShare('whatsapp')}>
            <svg 
              viewBox="0 0 24 24" 
              className="w-4 h-4 mr-2 fill-current"
            >
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
            </svg>
            WhatsApp
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
      case 'whatsapp':
        window.open(`https://wa.me/?text=${encodeURIComponent(`${title}\n${url}`)}`, '_blank');
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