import Link from "next/link";

const PlaceholderPage = ({ title, category, backLink }) => {
    return (
        <main className="min-h-screen bg-slate-50 dark:bg-slate-900 flex flex-col items-center justify-center p-4">
            <div className="absolute top-4 left-4">
                <Link
                    href={backLink}
                    className="inline-flex items-center text-blue-600 hover:text-blue-700 transition-colors"
                >
                    <svg
                        className="w-5 h-5 mr-2"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M10 19l-7-7m0 0l7-7m-7 7h18"
                        />
                    </svg>
                    Back to {category}
                </Link>
            </div>

            <div className="text-center max-w-2xl px-4">
                <h1 className="text-5xl font-bold mb-6 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent animate-pulse">
                    {title}
                </h1>
                <h2 className="text-3xl font-semibold mb-8 text-slate-700 dark:text-slate-200">
                    Coming Soon
                </h2>
                <p className="text-lg text-slate-600 dark:text-slate-400 mb-10">
                    We are working hard to bring you this amazing visualization.
                    Expect interactive demos, step-by-step explanations, and more!
                </p>

                <div className="relative group">
                    <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg blur opacity-25 group-hover:opacity-100 transition duration-1000 group-hover:duration-200"></div>
                    <Link
                        href="/"
                        className="relative px-8 py-4 bg-white dark:bg-slate-800 rounded-lg leading-none flex items-center divide-x divide-slate-200 dark:divide-slate-700"
                    >
                        <span className="flex items-center space-x-5">
                            <span className="pr-6 text-slate-900 dark:text-white font-medium">Explore Other Visualizers</span>
                        </span>
                        <span className="pl-6 text-indigo-400 group-hover:text-indigo-600 transition duration-200">
                            Go Home &rarr;
                        </span>
                    </Link>
                </div>
            </div>
        </main>
    );
};

export default PlaceholderPage;
