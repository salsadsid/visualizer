import JsonLd from "@/components/seo/JsonLd";
import { faqJsonLd } from "@/lib/jsonld";

export function Explainer({ children }) {
    return <article className="mt-8 max-w-3xl mx-auto space-y-5">{children}</article>;
}

export function ExplainerSection({ title, children }) {
    return (
        <section className="surface rounded-2xl p-5 md:p-6 shadow-sm">
            <h2 className="text-lg font-semibold tracking-tight mb-3">{title}</h2>
            <div className="space-y-3 text-base text-muted leading-relaxed">{children}</div>
        </section>
    );
}

export function InlineCode({ children }) {
    return <code className="font-mono text-[0.9em] text-accent">{children}</code>;
}

export function CodeBlock({ children }) {
    return (
        <pre className="surface-muted rounded-lg p-3 font-mono text-sm overflow-x-auto custom-scrollbar leading-relaxed text-text">
            {children}
        </pre>
    );
}

export function Faq({ title = "Questions people ask", items }) {
    return (
        <ExplainerSection title={title}>
            <JsonLd data={faqJsonLd(items)} />
            <div className="space-y-4">
                {items.map((item) => (
                    <div key={item.question}>
                        <h3 className="text-base font-semibold text-text">{item.question}</h3>
                        <p className="mt-1">{item.answer}</p>
                    </div>
                ))}
            </div>
        </ExplainerSection>
    );
}
