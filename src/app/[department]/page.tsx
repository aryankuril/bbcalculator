import type { Metadata } from "next";
import PreviewPage from "./PreviewPage"; // client component

export async function generateMetadata({
  params,
}: {
  params: { department: string };
}): Promise<Metadata> {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_URL}/api/get-questions?dept=${params.department}`,
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

export default function DepartmentPage() {
  return <PreviewPage />;
}
