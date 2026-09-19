import Link from "next/link";
import PageShell from "@/components/layout/PageShell";
import Footer from "@/components/layout/Footer";

export const metadata = {
    title: "Page not found",
    robots: { index: false, follow: true },
};

const TOOLS = [
    {
        href: "/data-structures/arrays",
        title: "2D Array Visualizer",
        body: "Paste a 2D array or matrix and see it as a grid.",
    },
    {
        href: "/algorithms/sorting",
        title: "Sorting Visualizer",
        body: "Step through Bubble, Selection and Insertion sort.",
    },
    {
        href: "/algorithms/complexity",
        title: "Big-O Playground",
        body: "Count steps and watch real growth curves.",
    },
];

export default function NotFound() {
    return (
        <PageShell max="max-w-4xl">
            <header className="pt-10 pb-10 text-center">
                <p className="text-6xl md:text-7xl font-bold tracking-tight text-gradient animate-gradient inline-block pb-1">
                    404
                </p>
                <h1 className="mt-3 text-2xl md:text-3xl font-bold tracking-tight">
                    This page isn&apos;t in the array
                </h1>
                <p className="mt-3 text-muted max-w-md mx-auto">
                    We searched every index and came back empty. The link may be old, or the
                    address may have a typo. One of these is probably what you wanted:
                </p>
            </header>

            <section className="grid sm:grid-cols-3 gap-4">
                {TOOLS.map((tool) => (
                    <Link
                        key={tool.href}
                        href={tool.href}
                        className="group surface rounded-2xl p-5 shadow-sm hover:border-strong hover:-translate-y-1 hover:shadow-lg transition-all"
                    >
                        <h2 className="font-semibold flex items-center gap-1.5">
                            {tool.title}
                            <span className="text-accent group-hover:translate-x-1 transition-transform">
                                →
                            </span>
                        </h2>
                        <p className="text-sm text-muted mt-1 leading-relaxed">{tool.body}</p>
                    </Link>
                ))}
            </section>

            <div className="mt-8 text-center">
                <Link
                    href="/"
                    className="inline-flex px-6 py-3 rounded-xl bg-accent text-white font-medium shadow-sm hover:bg-accent-hover transition-colors"
                >
                    Back to home
                </Link>
            </div>

            <Footer />
        </PageShell>
    );
}
