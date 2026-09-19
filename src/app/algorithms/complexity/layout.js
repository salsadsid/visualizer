import { buildMetadata } from "@/lib/seo";
import { TOOLS } from "@/lib/catalog";

export const metadata = buildMetadata(TOOLS.complexity);

export default function Layout({ children }) {
    return children;
}
