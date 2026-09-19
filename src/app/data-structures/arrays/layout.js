import { buildMetadata } from "@/lib/seo";
import { TOOLS } from "@/lib/catalog";

export const metadata = buildMetadata(TOOLS.arrays);

export default function Layout({ children }) {
    return children;
}
