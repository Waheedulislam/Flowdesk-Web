import Link from "next/link";

/** Shared, intentionally compact footer for authenticated application routes. */
export function AppFooter() {
  return (
    <footer className="shrink-0 border-t border-border px-4 py-3 lg:px-6">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-2 text-xs text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
        <p>© {new Date().getFullYear()} FlowDesk</p>
        <nav className="flex items-center gap-4" aria-label="Footer navigation">
          <Link href="#" className="hover:text-foreground">Privacy</Link>
          <Link href="#" className="hover:text-foreground">Terms</Link>
          <Link href="#" className="hover:text-foreground">Help</Link>
          <Link href="#" className="hover:text-foreground">Status</Link>
        </nav>
      </div>
    </footer>
  );
}
