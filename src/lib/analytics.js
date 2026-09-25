import { sendGAEvent } from "@next/third-parties/google";

const queued = [];
let flushTimer = null;

function flush() {
    flushTimer = null;
    if (!window.dataLayer) {
        flushTimer = setTimeout(flush, 250);
        return;
    }
    while (queued.length > 0) {
        const [name, params] = queued.shift();
        sendGAEvent("event", name, params);
    }
}

export function track(name, params = {}) {
    if (!process.env.NEXT_PUBLIC_GA_ID || typeof window === "undefined") return;
    if (window.dataLayer && queued.length === 0) {
        sendGAEvent("event", name, params);
        return;
    }
    queued.push([name, params]);
    if (!flushTimer) flushTimer = setTimeout(flush, 250);
}
