"use client";
import { useEffect, useState } from "react";

const BASE_MS = 650;
export const SPEEDS = [0.5, 1, 2, 4];

// Drives playback over a list of algorithm steps. Resets whenever the step list
// identity changes (new algorithm or new input array).
export function usePlayer(steps) {
    const [index, setIndex] = useState(0);
    const [playing, setPlaying] = useState(false);
    const [speed, setSpeed] = useState(1);
    const [prevSteps, setPrevSteps] = useState(steps);

    const total = steps.length;

    // Render-phase reset (React's recommended alternative to a reset-in-effect):
    // when a brand-new step list arrives, jump back to the start and stop.
    if (steps !== prevSteps) {
        setPrevSteps(steps);
        setIndex(0);
        setPlaying(false);
    }

    // Clamp so a render that happens before the reset can't read past the end.
    const clamped = Math.min(index, total - 1);
    const atEnd = clamped >= total - 1;
    const atStart = clamped <= 0;
    // `playing` is "the user wants to play"; once we hit the end there's nothing to
    // advance, so the effective state is paused.
    const isPlaying = playing && !atEnd;

    useEffect(() => {
        if (!playing || index >= total - 1) return;
        const id = setTimeout(
            () => setIndex((i) => Math.min(i + 1, total - 1)),
            BASE_MS / speed
        );
        return () => clearTimeout(id);
    }, [playing, index, total, speed]);

    const play = () => {
        if (atEnd) setIndex(0);
        setPlaying(true);
    };
    const pause = () => setPlaying(false);
    const toggle = () => (isPlaying ? pause() : play());
    const stepF = () => {
        setPlaying(false);
        setIndex((i) => Math.min(i + 1, total - 1));
    };
    const stepB = () => {
        setPlaying(false);
        setIndex((i) => Math.max(i - 1, 0));
    };
    const reset = () => {
        setPlaying(false);
        setIndex(0);
    };
    const seek = (i) => {
        setPlaying(false);
        setIndex(Math.max(0, Math.min(i, total - 1)));
    };

    return {
        index: clamped,
        step: steps[clamped],
        total,
        playing: isPlaying,
        speed,
        setSpeed,
        atEnd,
        atStart,
        play,
        pause,
        toggle,
        stepF,
        stepB,
        reset,
        seek,
    };
}
