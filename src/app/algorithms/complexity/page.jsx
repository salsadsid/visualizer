import Link from "next/link";
import PageShell from "@/components/layout/PageShell";
import BackLink from "@/components/layout/BackLink";
import Footer from "@/components/layout/Footer";
import LoopLab from "@/components/algorithms/LoopLab";
import ComplexityPlayground from "@/components/algorithms/ComplexityPlayground";
import ComplexityLearn from "@/components/algorithms/ComplexityLearn";

// Small numbered kicker that walks beginners through the page in order.
function StepKicker({ n, children }) {
    return (
        <div className="flex items-center gap-2.5 mb-3">
            <span className="grid place-items-center h-6 w-6 rounded-full bg-accent text-white text-xs font-bold shrink-0">
                {n}
            </span>
            <h2 className="text-xs font-semibold text-subtle uppercase tracking-wider">
                {children}
            </h2>
        </div>
    );
}

function BigIdea() {
    return (
        <section className="surface rounded-2xl p-5 md:p-6 shadow-sm space-y-4">
            <p className="text-sm md:text-[15px] leading-relaxed text-muted">
                Imagine finding <strong className="text-text">one name</strong> in a phone
                book with <strong className="text-text">1,000,000 names</strong>. You could
                do it two very different ways:
            </p>

            <div className="grid sm:grid-cols-2 gap-3">
                <div className="surface-muted rounded-xl p-4">
                    <div className="text-2xl mb-1">🐢</div>
                    <h3 className="text-sm font-semibold text-text">Page by page</h3>
                    <p className="text-xs text-muted mt-1 leading-relaxed">
                        Check every name, one at a time. Worst case:
                    </p>
                    <p className="text-xl font-bold tabular-nums mt-1.5">
                        1,000,000 <span className="text-xs font-normal text-subtle">checks</span>
                    </p>
                </div>
                <div className="surface-muted rounded-xl p-4">
                    <div className="text-2xl mb-1">⚡</div>
                    <h3 className="text-sm font-semibold text-text">Split in half, repeat</h3>
                    <p className="text-xs text-muted mt-1 leading-relaxed">
                        Open the middle — wrong half? Toss it. Repeat:
                    </p>
                    <p className="text-xl font-bold tabular-nums mt-1.5">
                        ~20 <span className="text-xs font-normal text-subtle">checks</span>
                    </p>
                </div>
            </div>

            <p className="text-sm md:text-[15px] leading-relaxed text-muted">
                Same phone book, same goal — <em>wildly</em> different amounts of work.{" "}
                <strong className="text-text">
                    Big-O is simply the label we put on that difference:
                </strong>{" "}
                it says how the number of steps grows when your data grows.
            </p>
            <p className="text-xs text-muted surface-muted rounded-lg px-3 py-2 inline-block">
                And <code className="font-mono text-accent">n</code>? Nothing scary —{" "}
                <code className="font-mono text-accent">n</code> just means{" "}
                <em>&ldquo;how many items you have&rdquo;</em>: 10 photos, 1,000 songs,
                1,000,000 users.
            </p>
            <p className="text-xs text-muted surface-muted rounded-lg px-3 py-2 inline-block">
                Say it like this:{" "}
                <code className="font-mono text-accent">O(n)</code> reads{" "}
                <em>&ldquo;oh of en&rdquo;</em> — the O stands for{" "}
                <em>order of</em>, i.e. &ldquo;roughly n steps&rdquo;. That&apos;s the whole
                notation.
            </p>
        </section>
    );
}

export default function ComplexityPage() {
    return (
        <PageShell>
            <nav className="mb-6">
                <BackLink href="/algorithms" label="All algorithms" />
            </nav>

            <header className="mb-8 text-center">
                <div className="inline-flex items-center gap-3 px-4 py-2 rounded-full surface-muted">
                    <span className="font-mono text-xs font-bold px-2 py-0.5 rounded bg-accent text-white">
                        BIG-O
                    </span>
                    <h1 className="text-xl md:text-2xl font-semibold tracking-tight">
                        Big-O Playground
                    </h1>
                </div>
                <p className="mt-3 text-sm text-muted max-w-lg mx-auto">
                    Never heard of Big-O? Perfect — start here. A tiny story, then count
                    steps with the computer, then watch real curves grow. No math degree
                    required. 🙌
                </p>
            </header>

            <div className="space-y-8">
                <div>
                    <StepKicker n={1}>The big idea</StepKicker>
                    <BigIdea />
                </div>

                <div>
                    <StepKicker n={2}>Count the steps yourself</StepKicker>
                    <LoopLab />
                </div>

                <div>
                    <StepKicker n={3}>Put names on the speeds</StepKicker>
                    <ComplexityLearn />
                </div>

                <div>
                    <StepKicker n={4}>Play in the sandbox</StepKicker>
                    <ComplexityPlayground />
                </div>
            </div>

            <p className="mt-8 text-center text-sm text-muted">
                Want to see an O(n²) algorithm actually move?{" "}
                <Link
                    href="/algorithms/sorting"
                    className="text-accent hover:text-accent-hover font-medium"
                >
                    Step through a sort in the Sorting Visualizer →
                </Link>
            </p>

            <Footer />
        </PageShell>
    );
}
