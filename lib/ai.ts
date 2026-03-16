import OpenAI from "openai";
import { addDays } from "date-fns";

export type PlanOutput = {
  goal: string;
  summary: string;
  phases: { name: string; workItems: { title: string; description: string; priority: "low" | "medium" | "high"; owner: string; dueDateOffsetDays: number }[] }[];
  milestones: { title: string; dueDateOffsetDays: number }[];
  dependencies: { fromTitle: string; toTitle: string; type: "blocks" }[];
  risks: { title: string; description: string; severity: "low" | "medium" | "high"; mitigation: string }[];
};

const mockPlan = (title: string): PlanOutput => ({
  goal: `Deliver ${title} on-time with clear ownership and risk controls.`,
  summary: "AI-generated MVP plan from brief with phased execution.",
  phases: [
    {
      name: "Discovery",
      workItems: [
        { title: "Finalize scope", description: "Align stakeholders on scope", priority: "high", owner: "PM", dueDateOffsetDays: -45 },
        { title: "Technical analysis", description: "Assess architecture and constraints", priority: "medium", owner: "Tech Lead", dueDateOffsetDays: -40 },
      ],
    },
    {
      name: "Execution",
      workItems: [
        { title: "Build core deliverables", description: "Implement priority workflows", priority: "high", owner: "Engineering", dueDateOffsetDays: -21 },
        { title: "QA and rollout prep", description: "Run tests and launch checklist", priority: "medium", owner: "QA", dueDateOffsetDays: -7 },
      ],
    },
  ],
  milestones: [
    { title: "Scope Approved", dueDateOffsetDays: -40 },
    { title: "Beta Ready", dueDateOffsetDays: -14 },
  ],
  dependencies: [{ fromTitle: "Finalize scope", toTitle: "Build core deliverables", type: "blocks" }],
  risks: [
    { title: "Scope creep", description: "New asks can shift timeline", severity: "high", mitigation: "Use change-control review" },
  ],
});

export async function generateProjectPlan(brief: string, title: string, targetDate: Date, projectType: string, teamSize: number): Promise<PlanOutput> {
  if (!process.env.OPENAI_API_KEY) return mockPlan(title);

  const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
  const prompt = `Create a project plan JSON for title=${title}, targetDate=${targetDate.toISOString()}, projectType=${projectType}, teamSize=${teamSize}. Brief: ${brief}`;

  const response = await client.responses.create({
    model: "gpt-4.1-mini",
    input: prompt,
    text: {
      format: {
        type: "json_schema",
        name: "project_plan",
        schema: {
          type: "object",
          properties: {
            goal: { type: "string" },
            summary: { type: "string" },
            phases: { type: "array", items: { type: "object", properties: { name: { type: "string" }, workItems: { type: "array", items: { type: "object", properties: { title: { type: "string" }, description: { type: "string" }, priority: { type: "string", enum: ["low", "medium", "high"] }, owner: { type: "string" }, dueDateOffsetDays: { type: "number" } }, required: ["title", "description", "priority", "owner", "dueDateOffsetDays"], additionalProperties: false } } }, required: ["name", "workItems"], additionalProperties: false } },
            milestones: { type: "array", items: { type: "object", properties: { title: { type: "string" }, dueDateOffsetDays: { type: "number" } }, required: ["title", "dueDateOffsetDays"], additionalProperties: false } },
            dependencies: { type: "array", items: { type: "object", properties: { fromTitle: { type: "string" }, toTitle: { type: "string" }, type: { type: "string", enum: ["blocks"] } }, required: ["fromTitle", "toTitle", "type"], additionalProperties: false } },
            risks: { type: "array", items: { type: "object", properties: { title: { type: "string" }, description: { type: "string" }, severity: { type: "string", enum: ["low", "medium", "high"] }, mitigation: { type: "string" } }, required: ["title", "description", "severity", "mitigation"], additionalProperties: false } }
          },
          required: ["goal", "summary", "phases", "milestones", "dependencies", "risks"],
          additionalProperties: false
        },
        strict: true
      }
    }
  });

  const parsed = JSON.parse(response.output_text) as PlanOutput;
  return parsed;
}

export function dueDateFromOffset(targetDate: Date, offsetDays: number) {
  return addDays(targetDate, offsetDays);
}

export async function generateReport(type: string, context: string) {
  if (!process.env.OPENAI_API_KEY) return `Mock ${type} report\n\n${context.slice(0, 500)}...`;
  const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
  const response = await client.responses.create({ model: "gpt-4.1-mini", input: `Create a concise ${type} report from this project context:\n${context}` });
  return response.output_text;
}
