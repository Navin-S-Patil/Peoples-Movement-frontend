// components/HydrationProvider.js
"use client";

import { useEffect, useState } from "react";
import usePdfStore from "@/store/usePdfStore";
import useNewsBlogStore from "@/store/useNewsBlogStore";

const HydrationProvider = ({ children, pdfMetadata, newsBlogData }) => {
  const [isHydrating, setIsHydrating] = useState(true);
  const { setPdfMetadata } = usePdfStore();
  const { setNewsBlogData } = useNewsBlogStore();

  useEffect(() => {
    // Delay hydration to ensure it happens after initial render
    const timer = setTimeout(() => {
      setPdfMetadata(pdfMetadata || []);
      setNewsBlogData(newsBlogData || []);
      setIsHydrating(false);
    }, 0);

    return () => clearTimeout(timer);
  }, [pdfMetadata, setPdfMetadata, newsBlogData, setNewsBlogData]);

  if (isHydrating) {
    return null; // Or return a loading spinner/skeleton
  }

  return <>{children}</>;
};

export default HydrationProvider;
