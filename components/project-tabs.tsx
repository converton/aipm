import Link from "next/link";

export function ProjectTabs({ projectId }: { projectId: string }) {
  const tabs = [
    ["Overview", `/projects/${projectId}`],
    ["Plan", `/projects/${projectId}/plan`],
    ["Health", `/projects/${projectId}/health`],
    ["Reports", `/projects/${projectId}/reports`],
  ];

  return (
    <div className="mb-4 flex gap-2 border-b pb-2 text-sm">
      {tabs.map(([label, href]) => (
        <Link key={href} href={href} className="rounded px-2 py-1 hover:bg-slate-100">{label}</Link>
      ))}
    </div>
  );
}
