import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const workspace = await prisma.workspace.upsert({
    where: { id: "demo-workspace" },
    update: {},
    create: { id: "demo-workspace", name: "Demo Workspace" },
  });

  await prisma.user.upsert({
    where: { email: "owner@projectpilot.dev" },
    update: {},
    create: {
      name: "Demo Owner",
      email: "owner@projectpilot.dev",
      workspaceId: workspace.id,
    },
  });

  const existing = await prisma.project.findFirst({ where: { title: "Website Revamp" } });
  if (existing) return;

  const project = await prisma.project.create({
    data: {
      workspaceId: workspace.id,
      title: "Website Revamp",
      goal: "Launch a higher-converting website.",
      brief: "Redesign marketing pages and migrate CMS.",
      projectType: "Marketing",
      teamSize: 6,
      status: "active",
      targetDate: new Date(Date.now() + 1000 * 60 * 60 * 24 * 60),
      healthScore: 83,
    },
  });

  const phase = await prisma.phase.create({ data: { projectId: project.id, name: "Discovery", order: 1 } });
  const wi1 = await prisma.workItem.create({
    data: {
      projectId: project.id,
      phaseId: phase.id,
      title: "Interview stakeholders",
      description: "Collect business and user requirements",
      owner: "PM",
      priority: "high",
      status: "in_progress",
      dueDate: new Date(Date.now() + 1000 * 60 * 60 * 24 * 7),
    },
  });
  await prisma.workItem.create({
    data: {
      projectId: project.id,
      phaseId: phase.id,
      title: "Audit analytics",
      description: "Understand baseline conversion funnel",
      owner: "Analyst",
      priority: "medium",
      status: "not_started",
      dueDate: new Date(Date.now() + 1000 * 60 * 60 * 24 * 9),
      dependenciesTo: { create: { projectId: project.id, fromWorkItemId: wi1.id, type: "blocks" } },
    },
  });

  await prisma.milestone.create({
    data: { projectId: project.id, title: "Discovery sign-off", dueDate: new Date(Date.now() + 1000 * 60 * 60 * 24 * 14) },
  });

  await prisma.risk.create({
    data: {
      projectId: project.id,
      title: "Delayed content approvals",
      description: "Brand/legal approval may slow publishing",
      severity: "medium",
      mitigation: "Set weekly approval checkpoint",
      status: "monitoring",
    },
  });
}

main().finally(async () => {
  await prisma.$disconnect();
});
