"use client";
import { useEffect } from "react";
import { track } from "@/lib/analytics";

export function usePlayerAnalytics(player, tool, algo) {
    const { atEnd, total } = player;

    useEffect(() => {
        if (atEnd && total > 1) track("run_complete", { tool, algo });
    }, [atEnd, total, tool, algo]);

    const play = () => {
        track("play", { tool, algo });
        player.play();
    };
    const toggle = () => {
        if (!player.playing) track("play", { tool, algo });
        player.toggle();
    };

    return { ...player, play, toggle };
}
