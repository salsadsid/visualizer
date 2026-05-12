import Link from "next/link";

export default function Footer() {
    return (
        <footer className="mt-12 border-t border-token pt-6 pb-2">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-sm">
                <div className="flex items-center gap-1.5 text-muted">
                    <span>&copy; {new Date().getFullYear()}</span>
                    <a
                        href="https://github.com/salsadsid"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-text hover:text-accent transition-colors font-medium"
                    >
                        Salman Sadik Siddiquee
                    </a>
                </div>
                <div className="flex items-center gap-4">
                    <Link
                        href="/roadmap"
                        className="text-muted hover:text-text transition-colors"
                    >
                        Roadmap
                    </Link>
                    <a
                        href="https://github.com/salsadsid/visualizer"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 text-muted hover:text-text transition-colors"
                    >
                        <svg
                            viewBox="0 0 24 24"
                            fill="currentColor"
                            className="w-4 h-4"
                            aria-hidden="true"
                        >
                            <path
                                fillRule="evenodd"
                                clipRule="evenodd"
                                d="M12 0C5.37 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.6.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.388-1.333-1.757-1.333-1.757-1.089-.745.084-.729.084-.729 1.205.085 1.838 1.237 1.838 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.333-5.467-5.93 0-1.31.469-2.38 1.236-3.22-.124-.303-.535-1.523.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.873.118 3.176.77.84 1.235 1.91 1.235 3.22 0 4.61-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z"
                            />
                        </svg>
                        GitHub
                    </a>
                </div>
            </div>
        </footer>
    );
}
