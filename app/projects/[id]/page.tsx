import { notFound } from "next/navigation";
import { Card } from "@/components/ui/card";
import { prisma } from "@/lib/prisma";
import { ProjectTabs } from "@/components/project-tabs";

export default async function ProjectOverviewPage({ params }: { params: { id: string } }) {
  const project = await prisma.project.findUnique({
    where: { id: params.id },
    include: { phases: true, milestones: true, risks: true },
  });
  if (!project) return notFound();

  return (
    <div>
      <ProjectTabs projectId={project.id} />
      <h1 className="mb-4 text-2xl font-semibold">{project.title}</h1>
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <h2 className="font-semibold">Summary</h2>
          <p className="text-sm text-slate-600">{project.goal}</p>
          <p className="mt-2 text-sm">{project.brief}</p>
        </Card>
        <Card>
          <h2 className="font-semibold">Health Score</h2>
          <div className="text-4xl font-bold">{project.healthScore}</div>
        </Card>
        <Card>
          <h2 className="mb-2 font-semibold">Phases</h2>
          <ul className="list-inside list-disc text-sm">{project.phases.map((p) => <li key={p.id}>{p.name}</li>)}</ul>
        </Card>
        <Card>
          <h2 className="mb-2 font-semibold">Milestones</h2>
          <ul className="space-y-1 text-sm">{project.milestones.map((m) => <li key={m.id}>{m.title} — {new Date(m.dueDate).toLocaleDateString()}</li>)}</ul>
        </Card>
        <Card>
          <h2 className="mb-2 font-semibold">Top Risks</h2>
          <ul className="space-y-1 text-sm">{project.risks.slice(0, 3).map((r) => <li key={r.id}>{r.title} ({r.severity})</li>)}</ul>
        </Card>
        <Card>
          <h2 className="mb-2 font-semibold">Recommended Actions</h2>
          <ul className="list-inside list-disc text-sm">
            <li>Address high-severity risks first.</li>
            <li>Assign owner for every open work item.</li>
            <li>Review milestones due within 2 weeks.</li>
          </ul>
        </Card>
      </div>
    </div>
  );
}
