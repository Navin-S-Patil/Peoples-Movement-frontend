import localFont from "next/font/local";
import "./globals.css";
import Navbar from "./components/Navbar";
import { ToasterProvider } from "@/components/providers/toaster-provider";
import Footer from "./components/Footer";
import QueryClientWrapper from "./components/QueryClientWrapper";
import HydrationProvider from "./components/HydrationProvider";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

async function fetchPDFMetadata() {
  const res = await fetch(`${process.env.API_URL}/pdf/metadata`, {
    // cache: "force-cache", // Utilize caching for performance
    headers: {
      "Cache-Control": "max-age=600", // Cache for 10 minutes
    },
    next: {
      revalidate: 600, // Revalidate cache every 10 minutes
    },
  });

  if (!res.ok) {
    console.error("Failed to fetch pdf metadata");
    return [];
  }

  const data = await res.json();

  if (!Array.isArray(data)) {
    console.error("Invalid data format received from PDF metadata API");
    return [];
  }

  if (data) console.log("------ PDF Data fetched from server -----");

  return data;
}

async function fetchNewsBlogData() {
  const res = await fetch(`${process.env.API_URL}/news`, {
    // cache: "force-cache", // Utilize caching for performance
    headers: {
      "Cache-Control": "max-age=600", // Cache for 10 minutes
    },
    next: {
      revalidate: 600, // Revalidate cache every 10 minutes
    },
  });

  if (!res.ok) {
    console.error("Failed to fetch NewsBlog data");
    return [];
  }

  const data = await res.json();

  if (!Array.isArray(data)) {
    console.error("Invalid data format received from newsBlog API");
    return [];
  }

  if (data) console.log("------ NewsBlog Data fetched from server -----");

  return data;
}

export default async function RootLayout({ children }) {
  const pdfMetadata = await fetchPDFMetadata();
  const newsBlogData = await fetchNewsBlogData();

  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <QueryClientWrapper>
          <HydrationProvider
            pdfMetadata={pdfMetadata}
            newsBlogData={newsBlogData}
          >
            <div suppressHydrationWarning>
              <Navbar />
              {children}
              <Footer />
              <ToasterProvider
                position="top-center"
                richColors
                toastOptions={{
                  className: "rounded-lg",
                  style: {
                    background: "#ffffff",
                    color: "#000000",
                    border: "1px solid #e5e7eb",
                  },
                }}
              />
            </div>
          </HydrationProvider>
        </QueryClientWrapper>
      </body>
    </html>
  );
}
