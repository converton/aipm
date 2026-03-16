import { notFound } from "next/navigation";
import { ProjectTabs } from "@/components/project-tabs";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { generateReportAction } from "@/lib/actions";
import { prisma } from "@/lib/prisma";

export default async function ProjectReportsPage({ params }: { params: { id: string } }) {
  const project = await prisma.project.findUnique({ where: { id: params.id }, include: { updates: { orderBy: { createdAt: "desc" } } } });
  if (!project) return notFound();

  return (
    <div>
      <ProjectTabs projectId={project.id} />
      <h1 className="mb-4 text-2xl font-semibold">Reports</h1>
      <div className="mb-6 flex flex-wrap gap-2">
        <form action={generateReportAction.bind(null, project.id, "weekly status")}><Button type="submit">Generate Weekly Status</Button></form>
        <form action={generateReportAction.bind(null, project.id, "executive summary")}><Button type="submit">Generate Executive Summary</Button></form>
        <form action={generateReportAction.bind(null, project.id, "customer update")}><Button type="submit">Generate Customer Update</Button></form>
      </div>
      <div className="space-y-3">
        {project.updates.map((u) => (
          <Card key={u.id}>
            <p className="mb-1 text-sm font-semibold capitalize">{u.type}</p>
            <p className="whitespace-pre-wrap text-sm text-slate-700">{u.content}</p>
          </Card>
        ))}
      </div>
    </div>
  );
}
