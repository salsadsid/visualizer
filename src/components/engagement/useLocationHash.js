"use client";
import { useSyncExternalStore } from "react";

const subscribe = (notify) => {
    window.addEventListener("hashchange", notify);
    return () => window.removeEventListener("hashchange", notify);
};

const getSnapshot = () => window.location.hash;

const getServerSnapshot = () => "";

export function useLocationHash() {
    return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}
