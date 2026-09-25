import { notFound } from "next/navigation";
import { ogContentType, ogSize, renderOg } from "@/lib/og";
import { TRAVERSAL_PAGES } from "@/lib/catalog";

export const alt = "A 2D array traversal visualizer that shows every step";
export const size = ogSize;
export const contentType = ogContentType;

export function generateStaticParams() {
    return Object.keys(TRAVERSAL_PAGES).map((kind) => ({ kind }));
}

export default async function Image({ params }) {
    const { kind } = await params;
    const page = TRAVERSAL_PAGES[kind];
    if (!page) notFound();
    return renderOg({
        eyebrow: "GRID",
        title: page.h1,
        accent: page.share.accent,
        subtitle: page.share.subtitle,
    });
}
