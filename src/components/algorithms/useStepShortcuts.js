"use client";
import { useEffect, useRef } from "react";

const SPACE_TARGETS = "button, a, input, textarea, select, summary, [role=tab]";
const ARROW_TARGETS = "input, textarea, select, [role=tab]";
const LETTER_TARGETS = "input, textarea, select, [contenteditable]";

const letterOf = (e) => {
    if (/^[a-z]$/i.test(e.key)) return e.key.toLowerCase();
    const match = /^Key([A-Z])$/.exec(e.code ?? "");
    return match ? match[1].toLowerCase() : null;
};

const letterHandler = (e, keys) => {
    if (!keys || e.repeat || e.isComposing || e.ctrlKey || e.metaKey || e.altKey) return null;
    const letter = letterOf(e);
    return letter && Object.hasOwn(keys, letter) ? keys[letter] : null;
};

export function useStepShortcuts(player, keys = null) {
    const playerRef = useRef(player);
    const keysRef = useRef(keys);
    const stageRef = useRef(null);

    useEffect(() => {
        playerRef.current = player;
        keysRef.current = keys;
    });

    useEffect(() => {
        const onKey = (e) => {
            const isSpace = e.code === "Space";
            const isArrow = e.key === "ArrowRight" || e.key === "ArrowLeft";
            const onLetter = isSpace || isArrow ? null : letterHandler(e, keysRef.current);
            if (!isSpace && !isArrow && !onLetter) return;
            const targets = isSpace ? SPACE_TARGETS : isArrow ? ARROW_TARGETS : LETTER_TARGETS;
            if (e.target?.closest?.(targets)) return;

            const stage = stageRef.current?.getBoundingClientRect();
            if (!stage || stage.bottom < 0 || stage.top > window.innerHeight) return;

            const p = playerRef.current;
            e.preventDefault();
            if (onLetter) onLetter();
            else if (isSpace) p.toggle();
            else if (e.key === "ArrowRight") p.stepF();
            else p.stepB();
        };
        window.addEventListener("keydown", onKey);
        return () => window.removeEventListener("keydown", onKey);
    }, []);

    return stageRef;
}
