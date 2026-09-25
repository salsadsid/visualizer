import TrackedLink from "@/components/analytics/TrackedLink";

export default function NextStep({ href, label, tool, from, children }) {
    return (
        <aside className="embed-hide mt-8 max-w-3xl mx-auto surface-muted rounded-2xl p-5 md:p-6 text-center">
            <p className="text-xs font-semibold uppercase tracking-wider text-subtle">
                Next step
            </p>
            <p className="mt-1.5 text-base text-muted leading-relaxed">{children}</p>
            <TrackedLink
                href={href}
                event="tool_open"
                params={{ tool, from }}
                className="group inline-flex items-center gap-1.5 mt-3 font-medium text-accent hover:text-accent-hover"
            >
                {label}
                <span className="group-hover:translate-x-1 transition-transform">→</span>
            </TrackedLink>
        </aside>
    );
}
