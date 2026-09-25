import { notFound } from "next/navigation";
import { ogContentType, ogSize, renderOg } from "@/lib/og";
import { GRID_PAGES } from "@/lib/catalog";

export const alt = "A grid algorithm visualizer that shows every step";
export const size = ogSize;
export const contentType = ogContentType;

export function generateStaticParams() {
    return Object.keys(GRID_PAGES).map((slug) => ({ slug }));
}

export default async function Image({ params }) {
    const { slug } = await params;
    const page = GRID_PAGES[slug];
    if (!page) notFound();
    return renderOg({
        eyebrow: "GRID",
        title: page.h1,
        accent: page.share.accent,
        subtitle: page.share.subtitle,
    });
}
