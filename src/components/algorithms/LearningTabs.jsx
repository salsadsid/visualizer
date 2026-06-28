"use client";
import { useState } from "react";
import { cn } from "@/lib/cn";

// Reusable language-tabbed code viewer. `groups` is { langId: [{ title, code }] }.
export function CodeTabs({ languages, groups }) {
    const [lang, setLang] = useState(languages[0].id);
    const snippets = groups[lang] || [];

    return (
        <div className="space-y-4">
            <div
                role="tablist"
                aria-label="Language"
                className="inline-flex flex-wrap gap-1 p-1 rounded-lg surface-muted"
            >
                {languages.map((l) => (
                    <button
                        key={l.id}
                        type="button"
                        role="tab"
                        aria-selected={lang === l.id}
                        onClick={() => setLang(l.id)}
                        className={cn(
                            "px-3 py-1.5 text-xs font-medium rounded-md transition-colors focus-ring",
                            lang === l.id
                                ? "bg-bg-elevated text-text shadow-sm border border-token"
                                : "text-muted hover:text-text"
                        )}
                    >
                        {l.label}
                    </button>
                ))}
            </div>

            {snippets.map((snippet, i) => (
                <div key={`${lang}-${i}`}>
                    {snippet.title && (
                        <div className="text-xs text-subtle uppercase tracking-wide mb-1.5">
                            {snippet.title}
                        </div>
                    )}
                    <pre className="surface-muted rounded-lg p-3 font-mono text-xs overflow-x-auto custom-scrollbar leading-relaxed">
                        {snippet.code}
                    </pre>
                </div>
            ))}
        </div>
    );
}

// Generic tabbed learning panel. `tabs` is [{ id, label, content }].
export default function LearningTabs({ heading = "Learn", tabs }) {
    const [active, setActive] = useState(tabs[0].id);
    const current = tabs.find((t) => t.id === active) || tabs[0];

    return (
        <section className="surface rounded-2xl p-5 md:p-6 shadow-sm">
            <h3 className="text-base font-semibold flex items-center gap-2 mb-4">
                <svg
                    className="w-4 h-4 text-accent"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={2}
                    viewBox="0 0 24 24"
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                    />
                </svg>
                {heading}
            </h3>

            <div className="flex flex-wrap gap-1 mb-4 border-b border-token">
                {tabs.map((tab) => (
                    <button
                        key={tab.id}
                        type="button"
                        onClick={() => setActive(tab.id)}
                        className={cn(
                            "px-3 py-2 text-sm font-medium transition-colors relative -mb-px border-b-2 focus-ring",
                            active === tab.id
                                ? "border-accent text-accent"
                                : "border-transparent text-muted hover:text-text"
                        )}
                    >
                        {tab.label}
                    </button>
                ))}
            </div>

            <div className="min-h-[140px]">{current.content}</div>
        </section>
    );
}
