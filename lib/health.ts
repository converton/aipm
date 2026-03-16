import { addDays, isBefore } from "date-fns";
import { Milestone, WorkItem } from "@prisma/client";

export function computeHealth(workItems: WorkItem[], milestones: Milestone[]) {
  const now = new Date();
  const overdue = workItems.filter((w) => isBefore(w.dueDate, now) && w.status !== "done").length;
  const blocked = workItems.filter((w) => w.status === "blocked").length;
  const stale = workItems.filter((w) => isBefore(w.lastActivityAt, addDays(now, -7)) && w.status !== "done").length;
  const missingOwner = workItems.filter((w) => !w.owner).length;
  const openCritical = workItems.filter((w) => w.priority === "high" && w.status !== "done").length;
  const milestoneRisk = milestones.filter((m) => isBefore(m.dueDate, addDays(now, 7)) && m.status !== "complete" && openCritical > 0).length;

  const score = Math.max(0, 100 - overdue * 10 - blocked * 8 - stale * 5 - missingOwner * 5 - milestoneRisk * 12);

  return { overdue, blocked, stale, missingOwner, milestoneRisk, score };
}
