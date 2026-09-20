import Link from "next/link";
import PageShell from "@/components/layout/PageShell";
import Breadcrumbs from "@/components/layout/Breadcrumbs";
import Footer from "@/components/layout/Footer";
import { LEARNING_PATH, PLANNED, ROADMAP_GROUPS } from "@/lib/catalog";
import { buildMetadata } from "@/lib/seo";

const ROADMAP = ROADMAP_GROUPS.map((section) => ({
    section,
    items: [
        ...LEARNING_PATH.filter((tool) => tool.group === section).map((tool) => ({
            name: tool.name,
            status: "shipped",
            note: tool.card.short,
            path: tool.path,
        })),
        ...PLANNED.filter((topic) => topic.group === section).map((topic) => ({
            ...topic,
            status: "planned",
        })),
    ],
}));

const STATUS_BADGE = {
    shipped: "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-500/10 dark:text-emerald-300 dark:border-emerald-500/20",
    "in-progress": "bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-500/10 dark:text-amber-300 dark:border-amber-500/20",
    planned: "bg-bg-muted text-text-muted border-token",
};

export const metadata = buildMetadata({
    title: "Roadmap",
    description:
        "What's shipped and what's planned for the DSA Visualizer: data structures, algorithms, and learning content.",
    path: "/roadmap",
});

export default function RoadmapPage() {
    return (
        <PageShell max="max-w-4xl">
            <Breadcrumbs className="mb-8" items={[{ name: "Roadmap" }]} />

            <header className="mb-10 text-center">
                <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-gradient animate-gradient inline-block pb-1">
                    Roadmap
                </h1>
                <p className="mt-3 text-muted max-w-xl mx-auto">
                    Built incrementally. Here&apos;s what&apos;s live and what&apos;s coming next.
                </p>
            </header>

            <div className="space-y-10">
                {ROADMAP.map((group) => (
                    <section key={group.section}>
                        <h2 className="text-xs font-semibold text-subtle uppercase tracking-wider mb-4">
                            {group.section}
                        </h2>
                        <ul className="space-y-2">
                            {group.items.map((item) => (
                                <li
                                    key={item.name}
                                    className="surface rounded-xl px-4 py-3 flex items-center justify-between gap-4 hover:border-strong hover:-translate-y-0.5 transition-all"
                                >
                                    <div className="min-w-0">
                                        <h3 className="font-medium">
                                            {item.path ? (
                                                <Link
                                                    href={item.path}
                                                    className="hover:text-accent transition-colors"
                                                >
                                                    {item.name}
                                                </Link>
                                            ) : (
                                                item.name
                                            )}
                                        </h3>
                                        <p className="text-xs text-muted mt-0.5">{item.note}</p>
                                    </div>
                                    <span
                                        className={`text-[10px] font-semibold uppercase tracking-wider px-2.5 py-1 rounded-full border whitespace-nowrap ${STATUS_BADGE[item.status]}`}
                                    >
                                        {item.status}
                                    </span>
                                </li>
                            ))}
                        </ul>
                    </section>
                ))}
            </div>

            <p className="mt-10 text-center text-xs text-subtle">
                Have a suggestion?{" "}
                <a
                    href="https://github.com/salsadsid/visualizer/issues"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-accent hover:text-accent-hover underline underline-offset-2"
                >
                    Open an issue
                </a>
                .
            </p>

            <Footer />
        </PageShell>
    );
}
