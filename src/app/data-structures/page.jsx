import Link from "next/link";
import PageShell from "@/components/layout/PageShell";
import Breadcrumbs from "@/components/layout/Breadcrumbs";
import Footer from "@/components/layout/Footer";
import TrackedLink from "@/components/analytics/TrackedLink";
import { plannedIn, toolsIn } from "@/lib/catalog";
import { buildMetadata } from "@/lib/seo";

export const metadata = buildMetadata({
    title: "Data Structures",
    description:
        "Beginner-friendly data structure visualizers. Paste a 2D array or matrix and see it as a grid, with linked lists, stacks, queues and trees on the way.",
    path: "/data-structures",
});

const GridIcon = (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={1.75} viewBox="0 0 24 24">
        <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"
        />
    </svg>
);

const ICONS = { arrays: GridIcon };

const SHIPPED = toolsIn("data-structures");
const COMING = plannedIn("data-structures");

export default function DataStructuresHome() {
    return (
        <PageShell max="max-w-4xl">
            <Breadcrumbs className="mb-8" items={[{ name: "Data Structures" }]} />

            <header className="mb-10 text-center">
                <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-gradient animate-gradient inline-block pb-1">
                    Data Structures
                </h1>
                <p className="mt-3 text-muted max-w-xl mx-auto">
                    See how data is laid out before you write code for it. Beginner-friendly,
                    interactive visualizers — no setup, no sign-up.
                </p>
            </header>

            <section className="grid sm:grid-cols-2 gap-4">
                {SHIPPED.map((item) => (
                    <TrackedLink
                        key={item.id}
                        href={item.path}
                        event="tool_open"
                        params={{ tool: item.id, from: "data_structures_hub" }}
                        className="group surface rounded-2xl p-6 shadow-sm hover:border-strong hover:-translate-y-1 hover:shadow-lg transition-all"
                    >
                        <div className="flex items-center justify-between mb-3">
                            <span className="grid place-items-center h-10 w-10 rounded-xl bg-accent-soft border border-accent/20 text-accent">
                                {ICONS[item.id]}
                            </span>
                            <span className="text-[10px] font-semibold uppercase tracking-wider px-2.5 py-1 rounded-full border bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-500/10 dark:text-emerald-300 dark:border-emerald-500/20 whitespace-nowrap">
                                {item.card.badge || "Live"}
                            </span>
                        </div>
                        <h2 className="text-lg font-semibold flex items-center gap-1.5">
                            {item.name}
                            <span className="text-accent group-hover:translate-x-1 transition-transform">
                                →
                            </span>
                        </h2>
                        <p className="text-base text-muted mt-1 leading-relaxed">
                            {item.card.body}
                        </p>
                        <div className="flex flex-wrap gap-1.5 mt-3">
                            {item.card.tags.map((t) => (
                                <span
                                    key={t}
                                    className="text-[11px] font-medium px-2 py-0.5 rounded surface-muted text-subtle"
                                >
                                    {t}
                                </span>
                            ))}
                        </div>
                    </TrackedLink>
                ))}

                <div className="surface-muted rounded-2xl p-6 border-dashed">
                    <h2 className="text-sm font-semibold text-subtle uppercase tracking-wider mb-3">
                        Coming next
                    </h2>
                    <div className="flex flex-wrap gap-1.5">
                        {COMING.map((t) => (
                            <span
                                key={t.name}
                                className="text-xs font-medium px-2.5 py-1 rounded-full surface text-muted"
                            >
                                {t.name}
                            </span>
                        ))}
                    </div>
                    <Link
                        href="/roadmap"
                        className="inline-block mt-4 text-sm text-accent hover:text-accent-hover font-medium"
                    >
                        See the full roadmap →
                    </Link>
                </div>
            </section>

            <Footer />
        </PageShell>
    );
}
