import { sendGAEvent } from "@next/third-parties/google";

export function track(name, params = {}) {
    if (!process.env.NEXT_PUBLIC_GA_ID || typeof window === "undefined") return;
    sendGAEvent("event", name, params);
}
