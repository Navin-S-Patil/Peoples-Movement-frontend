// EPaperClient.js
"use client";

import React, { useEffect } from "react";
import dynamic from "next/dynamic";
import { useFetchPDFMetadata } from "@/hooks/useFetchPDFMetadata";
import usePdfStore from "@/store/usePdfStore";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const PDFViewer = dynamic(() => import("@/components/PDFViewer"), {
  ssr: false,
  loading: () => (
    <Card className="w-full h-screen animate-pulse">
      <CardContent className="flex items-center justify-center h-full">
        <div className="w-full h-full bg-gray-200 rounded-lg" />
      </CardContent>
    </Card>
  ),
});

export default function EPaperClient() {
  const { setPdfMetadata } = usePdfStore();

  // Get initial data from store
  const { pdfMetadata: initialData } = usePdfStore();
  // console.log("initialData", initialData);

  const { data, isLoading, error } = useFetchPDFMetadata({
    initialData,
    enabled: !initialData || !Array.isArray(initialData)
  });

  const pdfPath = usePdfStore((state) => state.latestPdfUrl);
  const storeIsLoading = usePdfStore((state) => state.isLoading);

  // Handle state updates in useEffect
  useEffect(() => {
    const validData = data && Array.isArray(data) ? data : null;
    const validInitialData = initialData && Array.isArray(initialData) ? initialData : null;
    
    if (validInitialData && !isLoading) {
      setPdfMetadata(validInitialData);
    } else if (validData && !isLoading) {
      setPdfMetadata(validData);
    }
  }, [initialData, data, isLoading, setPdfMetadata]);

  if (error) {
    return (
      <Card className="w-full">
        <CardContent className="p-6">
          <div className="text-red-600">Error: {error.message}</div>
        </CardContent>
      </Card>
    );
  }

  if (storeIsLoading || isLoading) {
    return (
      <Card className="w-full h-screen animate-pulse">
        <CardContent className="flex items-center justify-center h-full">
          <div className="w-full h-full bg-gray-200 rounded-lg" />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>E-Paper</CardTitle>
      </CardHeader>
      <CardContent>
        {pdfPath ? (
          <PDFViewer url={pdfPath} />
        ) : (
          <div className="text-center py-8">No E-Paper available.</div>
        )}
      </CardContent>
    </Card>
  );
}