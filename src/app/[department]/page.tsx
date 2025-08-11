import type { Metadata } from "next";
import PreviewPage from "./PreviewPage"; // client component

type GenerateMetadataParams = { params: Promise<{ department: string }> };

export async function generateMetadata({ params }: GenerateMetadataParams): Promise<Metadata> {
  const awaitedParams = await params;
  
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_URL}/api/get-questions?dept=${awaitedParams.department}`,
    { cache: "no-store" }
  );

  if (!res.ok) {
    return { title: "Get a Free Digital Marketing Cost Calculator | Bombay Blokes" };
  }

  const data = await res.json();

  return {
    title: data.metaTitle || "Get a Free Digital Marketing Cost Calculator"
  };
}


export default function DepartmentPage() {
  return <PreviewPage />;
}
