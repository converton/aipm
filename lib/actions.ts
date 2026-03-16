"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { computeHealth } from "@/lib/health";
import { dueDateFromOffset, generateProjectPlan, generateReport } from "@/lib/ai";

const DEFAULT_WORKSPACE = "demo-workspace";

export async function createProjectAction(formData: FormData) {
  const title = String(formData.get("title") || "");
  const brief = String(formData.get("brief") || "");
  const projectType = String(formData.get("projectType") || "");
  const teamSize = Number(formData.get("teamSize") || 1);
  const targetDate = new Date(String(formData.get("targetDate") || new Date().toISOString()));

  const plan = await generateProjectPlan(brief, title, targetDate, projectType, teamSize);

  const project = await prisma.project.create({
    data: {
      workspaceId: DEFAULT_WORKSPACE,
      title,
      goal: plan.goal,
      brief,
      projectType,
      teamSize,
      targetDate,
      status: "active",
    },
  });

  const workItemByTitle = new Map<string, string>();

  for (const [index, phase] of plan.phases.entries()) {
    const createdPhase = await prisma.phase.create({ data: { projectId: project.id, name: phase.name, order: index + 1 } });
    for (const item of phase.workItems) {
      const workItem = await prisma.workItem.create({
        data: {
          projectId: project.id,
          phaseId: createdPhase.id,
          title: item.title,
          description: item.description,
          priority: item.priority,
          owner: item.owner || null,
          dueDate: dueDateFromOffset(targetDate, item.dueDateOffsetDays),
          aiSummary: plan.summary,
        },
      });
      workItemByTitle.set(item.title, workItem.id);
    }
  }

  for (const milestone of plan.milestones) {
    await prisma.milestone.create({ data: { projectId: project.id, title: milestone.title, dueDate: dueDateFromOffset(targetDate, milestone.dueDateOffsetDays) } });
  }

  for (const risk of plan.risks) {
    await prisma.risk.create({ data: { projectId: project.id, title: risk.title, description: risk.description, severity: risk.severity, mitigation: risk.mitigation } });
  }

  for (const dep of plan.dependencies) {
    const from = workItemByTitle.get(dep.fromTitle);
    const to = workItemByTitle.get(dep.toTitle);
    if (from && to) {
      await prisma.dependency.create({ data: { projectId: project.id, fromWorkItemId: from, toWorkItemId: to, type: dep.type } });
    }
  }

  const [workItems, milestones] = await Promise.all([
    prisma.workItem.findMany({ where: { projectId: project.id } }),
    prisma.milestone.findMany({ where: { projectId: project.id } }),
  ]);
  const health = computeHealth(workItems, milestones);
  await prisma.project.update({ where: { id: project.id }, data: { healthScore: health.score } });

  redirect(`/projects/${project.id}`);
}

export async function updateWorkItemAction(formData: FormData) {
  const id = String(formData.get("id"));
  const owner = String(formData.get("owner") || "");
  const status = String(formData.get("status") || "not_started") as "not_started" | "in_progress" | "blocked" | "done";
  const projectId = String(formData.get("projectId"));

  await prisma.workItem.update({ where: { id }, data: { owner: owner || null, status, lastActivityAt: new Date() } });

  const [workItems, milestones] = await Promise.all([
    prisma.workItem.findMany({ where: { projectId } }),
    prisma.milestone.findMany({ where: { projectId } }),
  ]);
  const health = computeHealth(workItems, milestones);
  await prisma.project.update({ where: { id: projectId }, data: { healthScore: health.score } });

  revalidatePath(`/projects/${projectId}/plan`);
  revalidatePath(`/projects/${projectId}`);
}

export async function generateReportAction(projectId: string, type: "weekly status" | "executive summary" | "customer update") {
  const project = await prisma.project.findUniqueOrThrow({
    where: { id: projectId },
    include: { workItems: true, milestones: true, risks: true },
  });
  const context = JSON.stringify(project);
  const content = await generateReport(type, context);
  await prisma.update.create({ data: { projectId, type, content } });
  revalidatePath(`/projects/${projectId}/reports`);
}
