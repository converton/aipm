import Link from "next/link";

export function Sidebar() {
  return (
    <aside className="w-full border-b bg-white p-4 md:min-h-screen md:w-56 md:border-b-0 md:border-r">
      <div className="mb-6 text-lg font-semibold">ProjectPilot</div>
      <nav className="flex gap-2 md:flex-col">
        <Link href="/" className="rounded px-3 py-2 hover:bg-slate-100">Dashboard</Link>
        <Link href="/projects/new" className="rounded px-3 py-2 hover:bg-slate-100">New Project</Link>
      </nav>
    </aside>
  );
}
