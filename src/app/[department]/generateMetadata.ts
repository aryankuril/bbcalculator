// src/app/[department]/generateMetadata.ts (SERVER FILE, no "use client")
import type { Metadata } from "next";

export async function generateMetadata({ params }: { params: { department: string } }): Promise<Metadata> {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_URL}/api/departments?id=${params.department}`,
    { cache: "no-store" }
  );
  const data = await res.json();

  return {
    title: data.metaTitle || data.name || "Default Title",
    description: data.metaDescription || "Default description",
  };
}
