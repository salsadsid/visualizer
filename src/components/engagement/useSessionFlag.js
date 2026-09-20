"use client";
import { useCallback, useSyncExternalStore } from "react";

const listeners = new Set();
const memory = new Set();

const subscribe = (notify) => {
    listeners.add(notify);
    return () => listeners.delete(notify);
};

const read = (key) => {
    if (memory.has(key)) return true;
    try {
        return window.sessionStorage.getItem(key) === "1";
    } catch {
        return false;
    }
};

const getServerSnapshot = () => true;

export function useSessionFlag(key) {
    const isSet = useSyncExternalStore(subscribe, () => read(key), getServerSnapshot);

    const set = useCallback(() => {
        memory.add(key);
        try {
            window.sessionStorage.setItem(key, "1");
        } catch {}
        listeners.forEach((notify) => notify());
    }, [key]);

    return [isSet, set];
}
