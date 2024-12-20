import ClientSidePage from './ClientSidePage';

// Server-side component to fetch metadata and pass it to the client component
export default async function ServerPage({ params }) {
  const { pdfId } = await params; // Await the params object
  
  return <ClientSidePage pdfId={pdfId} />; 
}
