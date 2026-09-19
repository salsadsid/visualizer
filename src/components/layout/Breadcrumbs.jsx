import Link from "next/link";
import JsonLd from "@/components/seo/JsonLd";
import { breadcrumbJsonLd } from "@/lib/jsonld";
import { cn } from "@/lib/cn";

export default function Breadcrumbs({ items, className }) {
    const trail = [{ name: "Home", path: "/" }, ...items];

    return (
        <nav aria-label="Breadcrumb" className={cn("mb-6", className)}>
            <JsonLd data={breadcrumbJsonLd(trail)} />
            <ol className="flex flex-wrap items-center gap-x-2 gap-y-1 text-sm text-muted">
                {trail.map((item, index) => {
                    const last = index === trail.length - 1;
                    return (
                        <li key={item.name} className="flex items-center gap-2">
                            {last ? (
                                <span aria-current="page" className="font-medium text-text">
                                    {item.name}
                                </span>
                            ) : (
                                <Link
                                    href={item.path}
                                    className="hover:text-text transition-colors"
                                >
                                    {item.name}
                                </Link>
                            )}
                            {!last && (
                                <span aria-hidden="true" className="text-subtle">
                                    /
                                </span>
                            )}
                        </li>
                    );
                })}
            </ol>
        </nav>
    );
}
