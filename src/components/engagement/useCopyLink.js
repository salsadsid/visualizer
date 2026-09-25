"use client";
import { useEffect, useState } from "react";

export function useCopyLink() {
    const [copied, setCopied] = useState(false);

    useEffect(() => {
        if (!copied) return;
        const id = setTimeout(() => setCopied(false), 2000);
        return () => clearTimeout(id);
    }, [copied]);

    const copy = async (url) => {
        try {
            await navigator.clipboard.writeText(url);
            setCopied(true);
        } catch {
            window.prompt("Copy this link", url);
        }
    };

    return [copied, copy];
}
