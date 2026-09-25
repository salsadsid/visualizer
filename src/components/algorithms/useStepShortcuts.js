"use client";
import { useEffect, useRef } from "react";

const SPACE_TARGETS = "button, a, input, textarea, select, summary, [role=tab]";
const ARROW_TARGETS = "input, textarea, select, [role=tab]";

export function useStepShortcuts(player) {
    const playerRef = useRef(player);
    const stageRef = useRef(null);

    useEffect(() => {
        playerRef.current = player;
    });

    useEffect(() => {
        const onKey = (e) => {
            const isSpace = e.code === "Space";
            const isArrow = e.key === "ArrowRight" || e.key === "ArrowLeft";
            if (!isSpace && !isArrow) return;
            if (e.target?.closest?.(isSpace ? SPACE_TARGETS : ARROW_TARGETS)) return;

            const stage = stageRef.current?.getBoundingClientRect();
            if (!stage || stage.bottom < 0 || stage.top > window.innerHeight) return;

            const p = playerRef.current;
            e.preventDefault();
            if (isSpace) p.toggle();
            else if (e.key === "ArrowRight") p.stepF();
            else p.stepB();
        };
        window.addEventListener("keydown", onKey);
        return () => window.removeEventListener("keydown", onKey);
    }, []);

    return stageRef;
}
