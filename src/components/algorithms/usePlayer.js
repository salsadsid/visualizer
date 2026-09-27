"use client";
import { useEffect, useState } from "react";

const BASE_MS = 650;
export const SPEEDS = [0.5, 1, 2, 4];

// Drives playback over a list of algorithm steps. Resets whenever the step list
// identity changes (new algorithm or new input array).
export function usePlayer(steps, startIndex = 0, { limit = Infinity, onRestart } = {}) {
    const startAt = Math.max(0, Math.min(startIndex, steps.length - 1));
    const [index, setIndex] = useState(startAt);
    const [playing, setPlaying] = useState(false);
    const [speed, setSpeed] = useState(1);
    const [prevSteps, setPrevSteps] = useState(steps);

    const total = steps.length;

    // Render-phase reset (React's recommended alternative to a reset-in-effect):
    // when a brand-new step list arrives, jump back to the start and stop.
    if (steps !== prevSteps) {
        setPrevSteps(steps);
        setIndex(startAt);
        setPlaying(false);
    }

    // Clamp so a render that happens before the reset can't read past the end.
    const last = Math.max(0, Math.min(total - 1, limit));
    const clamped = Math.min(index, last);
    const atEnd = clamped >= total - 1;
    const atStart = clamped <= 0;
    const atLimit = !atEnd && clamped >= last;
    // `playing` is "the user wants to play"; once we hit the end there's nothing to
    // advance, so the effective state is paused.
    const isPlaying = playing && !atEnd;

    useEffect(() => {
        if (!playing || index >= last) return;
        const id = setTimeout(
            () => setIndex((i) => Math.min(i + 1, last)),
            BASE_MS / speed
        );
        return () => clearTimeout(id);
    }, [playing, index, last, speed]);

    const play = () => {
        if (atEnd) {
            setIndex(0);
            onRestart?.();
        }
        setPlaying(true);
    };
    const pause = () => setPlaying(false);
    const toggle = () => (isPlaying ? pause() : play());
    const stepF = () => {
        if (atLimit) return;
        setPlaying(false);
        setIndex((i) => Math.min(i + 1, last));
    };
    const stepB = () => {
        setPlaying(false);
        setIndex((i) => Math.max(Math.min(i, last) - 1, 0));
    };
    const reset = () => {
        setPlaying(false);
        setIndex(0);
        onRestart?.();
    };
    const seek = (i) => {
        setPlaying(false);
        setIndex(Math.max(0, Math.min(i, last)));
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
        atLimit,
        play,
        pause,
        toggle,
        stepF,
        stepB,
        reset,
        seek,
    };
}
