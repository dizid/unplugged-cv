import { notFound } from "next/navigation";
import { Metadata } from "next";
import { getDb, cvGenerations } from "@/lib/db";
import { eq, and } from "drizzle-orm";
import { PublicCVView } from "./PublicCVView";

interface PageProps {
  params: Promise<{ slug: string }>;
}

async function getCV(slug: string) {
  const db = getDb();

  const cv = await db
    .select({
      id: cvGenerations.id,
      generatedCv: cvGenerations.generatedCv,
      title: cvGenerations.title,
      createdAt: cvGenerations.createdAt,
    })
    .from(cvGenerations)
    .where(and(eq(cvGenerations.slug, slug), eq(cvGenerations.isPublished, true)))
    .limit(1);

  return cv[0] || null;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const cv = await getCV(slug);

  if (!cv || !cv.generatedCv) {
    return {
      title: "CV Not Found | unplugged.cv",
    };
  }

  // Extract name from CV (first line is usually the name)
  const lines = cv.generatedCv.split("\n");
  const nameLine = lines.find((line) => line.startsWith("# "));
  const name = nameLine ? nameLine.replace("# ", "").trim() : "Professional CV";

  return {
    title: `${name} | unplugged.cv`,
    description: `Professional CV for ${name}. Created with unplugged.cv - AI-powered CV builder.`,
    openGraph: {
      title: `${name} - CV`,
      description: `Professional CV created with unplugged.cv`,
      type: "profile",
    },
  };
}

export default async function PublicCVPage({ params }: PageProps) {
  const { slug } = await params;
  const cv = await getCV(slug);

  if (!cv || !cv.generatedCv) {
    notFound();
  }

  return <PublicCVView cv={cv.generatedCv} />;
}
