"use client";
import { useEffect, useRef } from "react";
import { track } from "@/lib/analytics";

export function usePlayerAnalytics(player, tool, algo) {
    const { atEnd, total } = player;
    const armedRef = useRef(false);

    useEffect(() => {
        if (atEnd && total > 1 && armedRef.current) track("run_complete", { tool, algo });
    }, [atEnd, total, tool, algo]);

    const play = () => {
        armedRef.current = true;
        track("play", { tool, algo });
        player.play();
    };
    const toggle = () => {
        armedRef.current = true;
        if (!player.playing) track("play", { tool, algo });
        player.toggle();
    };
    const stepF = () => {
        armedRef.current = true;
        player.stepF();
    };
    const seek = (i) => {
        armedRef.current = true;
        player.seek(i);
    };

    return { ...player, play, toggle, stepF, seek };
}
