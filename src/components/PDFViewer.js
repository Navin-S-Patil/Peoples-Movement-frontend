"use client";
import React, { useState, useEffect, useMemo } from "react";
import { Document, Page, pdfjs } from "react-pdf";
import { Loader2, ZoomIn, ZoomOut, RotateCw, Download } from "lucide-react";
import { showToast } from "@/lib/toast";
import "react-pdf/dist/esm/Page/AnnotationLayer.css";
import "react-pdf/dist/esm/Page/TextLayer.css";

pdfjs.GlobalWorkerOptions.workerSrc = new URL(
  "pdfjs-dist/build/pdf.worker.min.mjs",
  import.meta.url
).toString();

const PDFViewer = ({ url }) => {
  const [numPages, setNumPages] = useState(null);
  const [pageNumber, setPageNumber] = useState(1);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [scale, setScale] = useState(1);
  const [rotation, setRotation] = useState(0);
  const [pageWidth, setPageWidth] = useState(null);

  const isMobile = window.innerWidth <= 768;

  // Memoize options to prevent unnecessary reloads
  const options = useMemo(
    () => ({
      cMapUrl: "https://unpkg.com/pdfjs-dist@4.4.168/cmaps/",
      cMapPacked: true,
    }),
    []
  );

  // Handle container resize and set scale for mobile
  useEffect(() => {
    const updateDimensions = () => {
      const container = document.getElementById("pdf-container");
      if (container) {
        const width = container.getBoundingClientRect().width;
        setPageWidth(width - 48);
        // Adjust scale for mobile screens
        setScale(isMobile ? width / 600 : 1);
      }
    };

    updateDimensions();
    window.addEventListener("resize", updateDimensions);
    return () => window.removeEventListener("resize", updateDimensions);
  }, [isMobile]);

  useEffect(() => {
    if (!url) {
      setError("No PDF URL provided");
      setIsLoading(false);
    } else {
      setIsLoading(true);
      setError(null);
    }
  }, [url]);

  const onDocumentLoadSuccess = ({ numPages }) => {
    setNumPages(numPages);
    setError(null);
    setIsLoading(false);
    setRotation(0);
  };

  const onDocumentLoadError = (error) => {
    console.error("PDF Load Error:", error);
    showToast.error(`Error loading PDF: ${error.message || "Unknown error"}`);
    setError(`Error loading PDF: ${error.message || "Unknown error"}`);
    setIsLoading(false);
  };

  const handleZoomIn = () => {
    setScale((prevScale) => Math.min(prevScale + 0.2, 3));
  };

  const handleZoomOut = () => {
    setScale((prevScale) => Math.max(prevScale - 0.2, 0.5));
  };

  const handleRotate = () => {
    setRotation((prevRotation) => (prevRotation + 90) % 360);
  };

  const handleDownload = () => {
    const downloadPromise = async () => {
      const response = await fetch(url);
      if (!response.ok) throw new Error("Download failed");
  
      const blob = await response.blob();
      const downloadUrl = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = downloadUrl;
      link.download = url.split("/").pop() || "document.pdf";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(downloadUrl);
    };
  
    showToast.promise(downloadPromise(), {
      loading: "Downloading PDF...",
      success: "PDF downloaded successfully!",
      error: "Failed to download PDF. Please try again.",
    });
  };

  if (!url) {
    return (
      <div className="text-red-500 p-4 text-center">No PDF file specified</div>
    );
  }

  return (
    <div className="min-w-full">
      <Document
        file={url}
        onLoadSuccess={onDocumentLoadSuccess}
        onLoadError={onDocumentLoadError}
        options={options}
        loading={
          <div className="flex items-center justify-center min-h-[50vh] p-4">
            <Loader2 className="h-8 w-8 animate-spin" />
            <span className="ml-2">Loading PDF...</span>
          </div>
        }
      >
        {error ? (
          <div className="text-red-500 p-4 text-center">
            <p>{error}</p>
            <p className="text-sm mt-2">URL attempted: {url}</p>
          </div>
        ) : (
          numPages && (
            <div className="space-y-4">
              {/* Controls */}
              <div className="flex flex-wrap gap-4 justify-center items-center p-2 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-2">
                  <button
                    onClick={handleZoomOut}
                    className="p-2 bg-white rounded-full shadow hover:bg-gray-100"
                    aria-label="Zoom out"
                  >
                    <ZoomOut className="h-5 w-5" />
                  </button>
                  <span className="text-sm">{Math.round(scale * 100)}%</span>
                  <button
                    onClick={handleZoomIn}
                    className="p-2 bg-white rounded-full shadow hover:bg-gray-100"
                    aria-label="Zoom in"
                  >
                    <ZoomIn className="h-5 w-5" />
                  </button>
                  <button
                    onClick={handleRotate}
                    className="p-2 bg-white rounded-full shadow hover:bg-gray-100"
                    aria-label="Rotate"
                  >
                    <RotateCw className="h-5 w-5" />
                  </button>
                  <button
                    onClick={handleDownload}
                    className="p-2 bg-white rounded-full shadow hover:bg-gray-100"
                    aria-label="Download PDF"
                  >
                    <Download className="h-5 w-5" />
                  </button>
                </div>

                <div className="flex items-center space-x-2">
                  <button
                    onClick={() =>
                      setPageNumber((page) => Math.max(page - 1, 1))
                    }
                    disabled={pageNumber <= 1}
                    className="px-3 py-1 bg-blue-500 text-white text-sm rounded disabled:opacity-50 transition-opacity"
                  >
                    Previous
                  </button>
                  <span className="text-sm">
                    Page {pageNumber} of {numPages}
                  </span>
                  <button
                    onClick={() =>
                      setPageNumber((page) => Math.min(page + 1, numPages))
                    }
                    disabled={pageNumber >= numPages}
                    className="px-3 py-1 bg-blue-500 text-white text-sm rounded disabled:opacity-50 transition-opacity"
                  >
                    Next
                  </button>
                </div>
              </div>

              {/* PDF Page */}
              <div
                id="pdf-container"
                className="border rounded-lg shadow-sm overflow-auto mx-auto p-6"
                style={{
                  maxHeight: "calc(100vh - 200px)",
                  width: "100%",
                }}
              >
                <div className="flex justify-center min-w-full">
                  <Page
                    key={`page_${pageNumber}_${scale}_${rotation}`}
                    pageNumber={pageNumber}
                    scale={scale}
                    rotate={rotation}
                    width={pageWidth}
                    renderTextLayer={false}
                    renderAnnotationLayer={false}
                    className="h-auto"
                    loading={
                      <div className="flex items-center justify-center p-4">
                        <Loader2 className="h-6 w-6 animate-spin" />
                      </div>
                    }
                  />
                </div>
              </div>
            </div>
          )
        )}
      </Document>
    </div>
  );
};

export default PDFViewer;
