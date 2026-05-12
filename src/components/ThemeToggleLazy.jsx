"use client";
import dynamic from "next/dynamic";

const ThemeToggle = dynamic(() => import("./ThemeToggle"), { ssr: false });

export default function ThemeToggleLazy() {
    return <ThemeToggle />;
}
