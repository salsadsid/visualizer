export default function PageShell({ children, max = "max-w-7xl" }) {
    return (
        <main className="min-h-screen bg-bg text-text transition-colors">
            <div className={`container mx-auto px-4 py-6 md:py-8 ${max}`}>
                {children}
            </div>
        </main>
    );
}
