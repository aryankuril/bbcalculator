import type { Metadata } from "next";
import PreviewPage from "./PreviewPage";

// ✅ Still handle metadata with `params` as a Promise
export async function generateMetadata(
  { params }: { params: Promise<{ department: string }> }
): Promise<Metadata> {
  const { department } = await params;

  const res = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_URL}/api/get-questions?dept=${department}`,
    { cache: "no-store" }
  );

  if (!res.ok) {
    return {
      title: "Get a Free Digital Marketing Cost Calculator | Bombay Blokes",
    };
  }

  const data = await res.json();

  return {
    title: data.metaTitle || "Get a Free Digital Marketing Cost Calculator",
  };
}

// ✅ No props sent to PreviewPage
export default function DepartmentPage() {
  return <PreviewPage />;
}
