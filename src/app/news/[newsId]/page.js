'use client';
import { useFetchSingleNewsBlog } from '@/hooks/useFetchSingleNewsBlog';
import NewsBlogDetail from '../../components/NewsBlogDetails';
import { useParams } from 'next/navigation';



export default function NewsPage() {
  const params = useParams(); // Get dynamic route params

  return <NewsBlogDetail newsId={params.newsId} />;
}


