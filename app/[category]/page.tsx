import Platform from "@/components/Platform";
import { categories } from "@/lib/brand";
import { notFound } from "next/navigation";
export function generateStaticParams() {
  return categories.map((c) => ({ category: c.slug }));
}
export default async function Page({
  params,
}: {
  params: Promise<{ category: string }>;
}) {
  const { category } = await params;
  if (!categories.some((c) => c.slug === category)) notFound();
  return <Platform category={category} />;
}
