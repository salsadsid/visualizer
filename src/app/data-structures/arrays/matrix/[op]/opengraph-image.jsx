import { notFound } from "next/navigation";
import { ogContentType, ogSize, renderOg } from "@/lib/og";
import { MATRIX_PAGES } from "@/lib/catalog";

export const alt = "A matrix operation visualizer that shows every cell move";
export const size = ogSize;
export const contentType = ogContentType;

export function generateStaticParams() {
    return Object.keys(MATRIX_PAGES).map((op) => ({ op }));
}

export default async function Image({ params }) {
    const { op } = await params;
    const page = MATRIX_PAGES[op];
    if (!page) notFound();
    return renderOg({
        eyebrow: "MATRIX",
        title: page.h1,
        accent: page.share.accent,
        subtitle: page.share.subtitle,
    });
}
