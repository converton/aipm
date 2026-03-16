import { notFound } from "next/navigation";
import { ProjectTabs } from "@/components/project-tabs";
import { Card } from "@/components/ui/card";
import { computeHealth } from "@/lib/health";
import { prisma } from "@/lib/prisma";

export default async function ProjectHealthPage({ params }: { params: { id: string } }) {
  const project = await prisma.project.findUnique({ where: { id: params.id }, include: { workItems: true, milestones: true } });
  if (!project) return notFound();
  const health = computeHealth(project.workItems, project.milestones);

  return (
    <div>
      <ProjectTabs projectId={project.id} />
      <h1 className="mb-4 text-2xl font-semibold">Project Health</h1>
      <div className="grid gap-4 md:grid-cols-3">
        <Card><p className="text-sm">Overdue work items</p><p className="text-3xl font-semibold">{health.overdue}</p></Card>
        <Card><p className="text-sm">Blocked work items</p><p className="text-3xl font-semibold">{health.blocked}</p></Card>
        <Card><p className="text-sm">Stale work items</p><p className="text-3xl font-semibold">{health.stale}</p></Card>
        <Card><p className="text-sm">Missing owners</p><p className="text-3xl font-semibold">{health.missingOwner}</p></Card>
        <Card><p className="text-sm">Milestone risks</p><p className="text-3xl font-semibold">{health.milestoneRisk}</p></Card>
        <Card><p className="text-sm">Health Score</p><p className="text-3xl font-semibold">{health.score}</p></Card>
      </div>
    </div>
  );
}
