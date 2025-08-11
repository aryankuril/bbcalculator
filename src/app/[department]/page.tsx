import type { Metadata } from "next";
import PreviewPage from "./PreviewPage"; // client component

type GenerateMetadataParams = { params: Promise<{ department: string }> };

export async function generateMetadata({ params }: GenerateMetadataParams): Promise<Metadata> {
  const awaitedParams = await params;

  // Determine base URL based on environment:
  const baseUrl =
    process.env.NODE_ENV === "production"
      ? "https://estimates.bombayblokes.com"
      : process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";

  const res = await fetch(
    `${baseUrl}/api/get-questions?dept=${awaitedParams.department}`,
    { cache: "no-store" }
  );

  if (!res.ok) {
    return { title: "Get a Free Digital Marketing Cost Calculator | Bombay Blokes" };
  }

  const data = await res.json();

  return {
    title: data.metaTitle || "Get a Free Digital Marketing Cost Calculator",
  };
}

export default function DepartmentPage() {
  return <PreviewPage />;
}
