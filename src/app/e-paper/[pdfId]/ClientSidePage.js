"use client";

import React, { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import usePdfStore from "@/store/usePdfStore";
import { useRouter } from "next/navigation";
import { useFetchPDFMetadata } from "@/hooks/useFetchPDFMetadata";

const PDFViewer = dynamic(() => import("@/components/PDFViewer"), {
  ssr: false,
  loading: () => (
    <div className="flex items-center justify-center min-h-[50vh] p-4">
      <div className="animate-spin h-8 w-8 border-4 border-blue-500 rounded-full border-t-transparent"></div>
    </div>
  ),
});

const ClientSidePage = ({ pdfId }) => {
  const { latestPdfUrl, setLatestPdfUrl } = usePdfStore();
  const { pdfMetadata } = usePdfStore();
  const [loading, setLoading] = useState(true);

  const { data, isLoading, error } = useFetchPDFMetadata({
    pdfMetadata,
    enabled: !pdfMetadata || !Array.isArray(pdfMetadata),
  });

  const router = useRouter();

  useEffect(() => {
    if (pdfMetadata && pdfMetadata[0]?.url) {
      setLatestPdfUrl(pdfMetadata[0].url);
    }
  }, [pdfMetadata, setLatestPdfUrl]);

  useEffect(() => {
    if (isLoading === false) {
      setLoading(false);
    }
  }, [isLoading]);

  // Construct the PDF URL from store data or API response
  const pdfUrl = latestPdfUrl?.split("pdfs/")[0] + "pdfs/" + pdfId;

  const handleBack = () => {
    console.log("document.referrer", document.referrer);
    if (
      document.referrer &&
      document.referrer.includes(window.location.origin)
    ) {
      // Go back if the user came from the same site
      router.back();
    } else {
      // Fallback to default archive route
      router.push("/e-paper");
    }
  };

  // Handle if no valid pdfUrl is available
  if (!pdfUrl || isLoading) {
    return (
      <div className="container mx-auto px-2 sm:px-4 py-4">
        <div className="flex items-center mb-4">
          <Button variant="ghost" className="gap-2" onClick={handleBack}>
            <ArrowLeft className="w-4 h-4" />
            Back to Archives
          </Button>
        </div>
        <h1 className="text-xl sm:text-2xl font-bold mb-4 text-center">
          E-Paper
        </h1>
        <div className="flex justify-center items-center min-h-[50vh]">
          <div className="animate-spin h-8 w-8 border-4 border-blue-500 rounded-full border-t-transparent"></div>
        </div>
      </div>
    );
  }

  // If no data is found for the given pdfId
  if (!data || !data.find((item) => item.pdfId === pdfId)) {
    eturn(
      <div className="container mx-auto px-2 sm:px-4 py-4">
        <div className="flex items-center mb-4">
          <Button variant="ghost" className="gap-2" onClick={handleBack}>
            <ArrowLeft className="w-4 h-4" />
            Back to Archives
          </Button>
        </div>
        <h1 className="text-xl sm:text-2xl font-bold mb-4 text-center">
          PDF Not Found
        </h1>
        <div className="text-center text-gray-500">
          Sorry, the PDF you&apos;re looking for could not be found.
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-2 sm:px-4 py-4">
      <div className="flex items-center mb-4">
        <Button variant="ghost" className="gap-2" onClick={handleBack}>
          <ArrowLeft className="w-4 h-4" />
          Back to Archives
        </Button>
      </div>

      <h1 className="text-xl sm:text-2xl font-bold mb-4 text-center">
        E-Paper
      </h1>
      <PDFViewer url={pdfUrl} />
    </div>
  );
};

export default ClientSidePage;
