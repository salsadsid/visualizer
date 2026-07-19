import Link from "next/link";

function LogoMark({ className }) {
    return (
        <svg
            width="30"
            height="30"
            viewBox="0 0 64 64"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            aria-hidden="true"
            className={className}
        >
            <defs>
                <linearGradient
                    id="hdrMark"
                    x1="6"
                    y1="4"
                    x2="58"
                    y2="60"
                    gradientUnits="userSpaceOnUse"
                >
                    <stop stopColor="#6366F1" />
                    <stop offset="0.5" stopColor="#A855F7" />
                    <stop offset="1" stopColor="#EC4899" />
                </linearGradient>
            </defs>
            <rect width="64" height="64" rx="15" fill="url(#hdrMark)" />
            <g fill="#FFFFFF">
                <rect x="11" y="32" width="10" height="20" rx="4" opacity="0.75" />
                <rect x="27" y="22" width="10" height="30" rx="4" opacity="0.88" />
                <rect x="43" y="12" width="10" height="40" rx="4" />
            </g>
        </svg>
    );
}

export default function SiteHeader() {
    return (
        <header className="sticky top-0 z-40 border-b border-token bg-bg/80 backdrop-blur-md">
            <div className="max-w-7xl mx-auto px-4 h-14 flex items-center justify-between gap-4">
                <Link
                    href="/"
                    aria-label="DSA Visualizer — home"
                    className="group inline-flex items-center gap-2.5"
                >
                    <LogoMark className="transition-transform group-hover:scale-110" />
                    <span className="text-[15px] tracking-tight">
                        <span className="font-bold">DSA</span>{" "}
                        <span className="font-semibold text-muted max-sm:hidden">
                            Visualizer
                        </span>
                    </span>
                </Link>

                <nav className="flex items-center gap-1 text-sm">
                    <Link
                        href="/algorithms"
                        className="inline-flex px-3 py-1.5 rounded-lg text-muted hover:text-text hover:bg-bg-muted transition-colors"
                    >
                        Algorithms
                    </Link>
                    <Link
                        href="/roadmap"
                        className="inline-flex px-3 py-1.5 rounded-lg text-muted hover:text-text hover:bg-bg-muted transition-colors"
                    >
                        Roadmap
                    </Link>
                    <a
                        href="https://github.com/salsadsid/visualizer"
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label="GitHub repository"
                        className="grid place-items-center h-9 w-9 rounded-lg text-muted hover:text-text hover:bg-bg-muted transition-colors"
                    >
                        <svg
                            viewBox="0 0 24 24"
                            fill="currentColor"
                            className="w-5 h-5"
                            aria-hidden="true"
                        >
                            <path
                                fillRule="evenodd"
                                clipRule="evenodd"
                                d="M12 0C5.37 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.6.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.388-1.333-1.757-1.333-1.757-1.089-.745.084-.729.084-.729 1.205.085 1.838 1.237 1.838 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.333-5.467-5.93 0-1.31.469-2.38 1.236-3.22-.124-.303-.535-1.523.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.873.118 3.176.77.84 1.235 1.91 1.235 3.22 0 4.61-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z"
                            />
                        </svg>
                    </a>
                </nav>
            </div>
        </header>
    );
}
