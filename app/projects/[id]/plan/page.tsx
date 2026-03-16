import { notFound } from "next/navigation";
import { ProjectTabs } from "@/components/project-tabs";
import { Card } from "@/components/ui/card";
import { updateWorkItemAction } from "@/lib/actions";
import { prisma } from "@/lib/prisma";
import { Button } from "@/components/ui/button";

export default async function ProjectPlanPage({ params }: { params: { id: string } }) {
  const project = await prisma.project.findUnique({
    where: { id: params.id },
    include: { phases: { include: { workItems: true }, orderBy: { order: "asc" } }, dependencies: { include: { fromWorkItem: true, toWorkItem: true } } },
  });
  if (!project) return notFound();

  return (
    <div>
      <ProjectTabs projectId={project.id} />
      <h1 className="mb-4 text-2xl font-semibold">Project Plan</h1>
      <div className="space-y-4">
        {project.phases.map((phase) => (
          <Card key={phase.id}>
            <h2 className="mb-2 font-semibold">{phase.name}</h2>
            <div className="space-y-2">
              {phase.workItems.map((item) => (
                <form action={updateWorkItemAction} key={item.id} className="grid items-end gap-2 rounded border p-2 md:grid-cols-5">
                  <input type="hidden" name="id" value={item.id} />
                  <input type="hidden" name="projectId" value={project.id} />
                  <div className="md:col-span-2">
                    <p className="font-medium">{item.title}</p>
                    <p className="text-xs text-slate-500">{item.description}</p>
                  </div>
                  <input name="owner" defaultValue={item.owner ?? ""} placeholder="Owner" className="rounded border p-2" />
                  <select name="status" defaultValue={item.status} className="rounded border p-2">
                    <option value="not_started">not_started</option>
                    <option value="in_progress">in_progress</option>
                    <option value="blocked">blocked</option>
                    <option value="done">done</option>
                  </select>
                  <Button type="submit">Save</Button>
                </form>
              ))}
            </div>
          </Card>
        ))}
        <Card>
          <h2 className="mb-2 font-semibold">Dependencies</h2>
          <ul className="text-sm">{project.dependencies.map((d) => <li key={d.id}>{d.fromWorkItem.title} → {d.toWorkItem.title} ({d.type})</li>)}</ul>
        </Card>
      </div>
    </div>
  );
}
