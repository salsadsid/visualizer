import { notFound } from "next/navigation";
import { ogContentType, ogSize, renderOg } from "@/lib/og";
import { SORT_PAGES } from "@/lib/catalog";

export const alt = "A sorting algorithm visualizer that shows every step";
export const size = ogSize;
export const contentType = ogContentType;

export function generateStaticParams() {
    return Object.keys(SORT_PAGES).map((algo) => ({ algo }));
}

export default async function Image({ params }) {
    const { algo } = await params;
    const page = SORT_PAGES[algo];
    if (!page) notFound();
    return renderOg({
        eyebrow: "SORT",
        title: page.h1,
        accent: page.share.accent,
        subtitle: page.share.subtitle,
    });
}
