"use client";
import { useState } from "react";
import TrackedLink from "@/components/analytics/TrackedLink";
import { useSessionFlag } from "@/components/engagement/useSessionFlag";
import { track } from "@/lib/analytics";
import { siteConfig } from "@/lib/site";

export default function RunCompleteNudge({ show, tool, algo, path }) {
    const [dismissed, dismiss] = useSessionFlag("run-nudge-dismissed");
    const [copied, setCopied] = useState(false);

    if (!show || dismissed) return null;

    const copyLink = async () => {
        const url = `${siteConfig.url}${path}`;
        track("share_click", { tool, algo });
        try {
            await navigator.clipboard.writeText(url);
            setCopied(true);
        } catch {
            window.prompt("Copy this link", url);
        }
    };

    return (
        <div className="flex flex-wrap items-center justify-center gap-x-3 gap-y-2 rounded-xl bg-accent-soft border border-accent/20 px-3 py-2 text-sm animate-fade-in-up">
            <span className="text-muted">Enjoyed that?</span>
            <TrackedLink
                external
                event="github_click"
                params={{ from: "run_complete" }}
                onClick={dismiss}
                href={siteConfig.repo}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 font-medium text-accent hover:text-accent-hover"
            >
                <span aria-hidden="true" className="text-amber-500">★</span>
                Star on GitHub
            </TrackedLink>
            <button
                type="button"
                onClick={copyLink}
                className="font-medium text-accent hover:text-accent-hover focus-ring rounded"
            >
                <span aria-live="polite">{copied ? "Link copied" : "Copy link"}</span>
            </button>
            <button
                type="button"
                onClick={dismiss}
                aria-label="Dismiss"
                className="grid place-items-center h-6 w-6 rounded-md text-subtle hover:text-text hover:bg-bg-muted transition-colors focus-ring"
            >
                <span aria-hidden="true">✕</span>
            </button>
        </div>
    );
}
