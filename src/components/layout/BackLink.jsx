import Link from "next/link";

export default function BackLink({ href, label }) {
    return (
        <Link
            href={href}
            className="group inline-flex items-center gap-2 text-sm text-muted hover:text-text transition-colors"
        >
            <span className="grid place-items-center h-8 w-8 rounded-full surface-muted group-hover:border-strong transition-colors">
                <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={2}
                    viewBox="0 0 24 24"
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M10 19l-7-7m0 0l7-7m-7 7h18"
                    />
                </svg>
            </span>
            <span className="font-medium">{label}</span>
        </Link>
    );
}
