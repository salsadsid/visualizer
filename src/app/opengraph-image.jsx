import { ogContentType, ogSize, renderOg } from "@/lib/og";

export const alt = "DSA Visualizer — interactive data structures & algorithms";
export const size = ogSize;
export const contentType = ogContentType;

export default function Image() {
    return renderOg({
        title: "Data structures & algorithms,",
        accent: "brought to life.",
        subtitle:
            "A 2D array visualizer, step-by-step sorting and a Big-O playground. Free, interactive and beginner friendly.",
    });
}
