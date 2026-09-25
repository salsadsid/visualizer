"use client";
import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useLocationHash } from "@/components/engagement/useLocationHash";
import { EMBED_PARAM, toolForPath, withEmbed } from "@/lib/embed";
import { track } from "@/lib/analytics";
import { siteConfig } from "@/lib/site";

const isEmbedded = () => document.documentElement.dataset.embed === "1";

export default function EmbedFrame() {
    const pathname = usePathname();
    const hash = useLocationHash();
    const router = useRouter();

    useEffect(() => {
        if (!isEmbedded()) return;
        track("embed_view", { tool: toolForPath(pathname) ?? "site" });
    }, [pathname]);

    useEffect(() => {
        if (!isEmbedded()) return undefined;
        const keepEmbed = (event) => {
            if (event.defaultPrevented || event.button !== 0) return;
            if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
            const anchor = event.target instanceof Element ? event.target.closest("a[href]") : null;
            if (!anchor || anchor.target || anchor.hasAttribute("download")) return;
            if (anchor.origin !== window.location.origin) return;
            if (anchor.getAttribute("href")?.startsWith("#")) return;
            if (new URLSearchParams(anchor.search).get(EMBED_PARAM) === "1") return;
            event.preventDefault();
            router.push(withEmbed(`${anchor.pathname}${anchor.search}${anchor.hash}`));
        };
        document.addEventListener("click", keepEmbed, true);
        return () => document.removeEventListener("click", keepEmbed, true);
    }, [router]);

    return (
        <a
            href={`${siteConfig.url}${pathname}${hash}`}
            target="_blank"
            rel="noopener"
            onClick={() => track("tool_open", { tool: toolForPath(pathname) ?? "site", from: "embed" })}
            className="embed-only fixed bottom-3 right-3 z-50 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full surface shadow-lg text-xs font-medium text-text hover:border-strong focus-ring"
        >
            Open in {siteConfig.shortName} ↗
        </a>
    );
}
