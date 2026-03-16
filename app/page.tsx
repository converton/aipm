import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default async function DashboardPage() {
  const projects = await prisma.project.findMany({ orderBy: { updatedAt: "desc" } });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Dashboard</h1>
        <Link href="/projects/new"><Button>Create New Project</Button></Link>
      </div>
      <div className="grid gap-4">
        {projects.map((p) => (
          <Card key={p.id}>
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div>
                <Link href={`/projects/${p.id}`} className="text-lg font-medium hover:underline">{p.title}</Link>
                <p className="text-sm text-slate-500">Target {new Date(p.targetDate).toLocaleDateString()}</p>
              </div>
              <div className="text-sm">Status: <span className="font-medium">{p.status}</span></div>
              <div className="text-sm">Health: <span className="font-medium">{p.healthScore}</span></div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
