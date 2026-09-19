import { buildMetadata } from "@/lib/seo";
import { TOOLS } from "@/lib/catalog";

export const metadata = buildMetadata({
    ...TOOLS.arrays,
    image: `${TOOLS.arrays.path}/opengraph-image`,
});

export default function Layout({ children }) {
    return children;
}
