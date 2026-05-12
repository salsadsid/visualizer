"use client";
import { useSyncExternalStore } from "react";

const subscribe = (callback) => {
    const target = document.documentElement;
    const observer = new MutationObserver(callback);
    observer.observe(target, { attributes: true, attributeFilter: ["class"] });
    return () => observer.disconnect();
};

const getSnapshot = () =>
    document.documentElement.classList.contains("dark") ? "dark" : "light";

const getServerSnapshot = () => "light";

export default function ThemeToggle() {
    const theme = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

    const toggleTheme = () => {
        const next = theme === "light" ? "dark" : "light";
        if (next === "dark") {
            document.documentElement.classList.add("dark");
        } else {
            document.documentElement.classList.remove("dark");
        }
        try {
            localStorage.setItem("theme", next);
        } catch (_) {}
    };

    return (
        <button
            onClick={toggleTheme}
            className="fixed bottom-5 right-5 z-50 grid h-11 w-11 place-items-center rounded-full surface shadow-lg transition-all hover:scale-105 hover:border-strong focus-ring"
            aria-label="Toggle theme"
            title={theme === "light" ? "Switch to dark mode" : "Switch to light mode"}
        >
            {theme === "light" ? (
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="h-5 w-5 text-text"
                >
                    <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
                </svg>
            ) : (
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="h-5 w-5 text-text"
                >
                    <circle cx="12" cy="12" r="4" />
                    <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41" />
                </svg>
            )}
        </button>
    );
}
