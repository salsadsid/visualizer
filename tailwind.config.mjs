/** @type {import('tailwindcss').Config} */
const config = {
    content: [
        "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
        "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
        "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    ],
    darkMode: "class",
    theme: {
        extend: {
            fontFamily: {
                sans: ["var(--font-sans)", "ui-sans-serif", "system-ui", "sans-serif"],
                mono: ["var(--font-mono)", "ui-monospace", "SFMono-Regular", "monospace"],
            },
            colors: {
                bg: "var(--bg)",
                "bg-elevated": "var(--bg-elevated)",
                "bg-muted": "var(--bg-muted)",
                "bg-subtle": "var(--bg-subtle)",
                text: "var(--text)",
                "text-muted": "var(--text-muted)",
                "text-subtle": "var(--text-subtle)",
                border: "var(--border)",
                "border-strong": "var(--border-strong)",
                accent: {
                    DEFAULT: "var(--accent)",
                    hover: "var(--accent-hover)",
                    soft: "var(--accent-soft)",
                },
            },
        },
    },
    plugins: [],
    safelist: [
        {
            pattern: /grid-cols-./,
        },
    ],
};

export default config;
