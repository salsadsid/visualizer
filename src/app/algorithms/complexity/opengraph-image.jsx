import { ogContentType, ogSize, renderOg } from "@/lib/og";

export const alt = "Big-O Playground — learn time complexity by measuring it";
export const size = ogSize;
export const contentType = ogContentType;

export default function Image() {
    return renderOg({
        eyebrow: "BIG-O",
        title: "Big-O Playground",
        accent: "Count the steps yourself.",
        subtitle:
            "Measure O(1) to O(n²) for real and watch the growth curves fan out. No math degree required.",
    });
}
