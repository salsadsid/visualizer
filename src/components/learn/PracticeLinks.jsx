import TrackedLink from "@/components/analytics/TrackedLink";
import { PRACTICE, PRACTICE_SITES } from "@/lib/practice";
import { cn } from "@/lib/cn";

export default function PracticeLinks({ path, tool, algo }) {
    const items = PRACTICE[path];
    if (!items) return null;
    return (
        <aside aria-labelledby="practice-heading" className="embed-hide mt-8 max-w-3xl mx-auto">
            <h2 id="practice-heading" className="text-lg font-semibold tracking-tight">
                Practice it
            </h2>
            <p className="mt-1 text-sm text-muted">
                Free problems that use exactly this idea. Each one opens in a new tab.
            </p>
            <ul className={cn("mt-4 grid gap-3", items.length === 2 ? "sm:grid-cols-2" : "sm:grid-cols-3")}>
                {items.map((item) => (
                    <li key={item.url}>
                        <TrackedLink
                            external
                            event="practice_click"
                            params={algo ? { tool, algo, site: item.site } : { tool, site: item.site }}
                            href={item.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="group flex h-full flex-col gap-2 rounded-2xl surface p-4 shadow-sm transition-colors hover:border-accent/40 focus-ring"
                        >
                            <span className="flex items-center justify-between gap-2 text-[11px] uppercase tracking-wide text-subtle">
                                <span>{PRACTICE_SITES[item.site]}</span>
                                <span>{item.level}</span>
                            </span>
                            <span className="text-sm font-semibold text-text group-hover:text-accent">
                                {item.title}{" "}
                                <span aria-hidden="true" className="text-subtle">
                                    ↗
                                </span>
                            </span>
                            <span className="text-xs leading-relaxed text-muted">{item.note}</span>
                            <span className="sr-only">(opens in a new tab)</span>
                        </TrackedLink>
                    </li>
                ))}
            </ul>
        </aside>
    );
}
