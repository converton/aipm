import { createProjectAction } from "@/lib/actions";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

export default function NewProjectPage() {
  return (
    <Card className="mx-auto max-w-3xl space-y-4">
      <h1 className="text-2xl font-semibold">New AI Project</h1>
      <form action={createProjectAction} className="grid gap-3">
        <input name="title" placeholder="Project title" className="rounded border p-2" required />
        <input name="targetDate" type="date" className="rounded border p-2" required />
        <input name="projectType" placeholder="Project type" className="rounded border p-2" required />
        <input name="teamSize" type="number" min={1} defaultValue={5} className="rounded border p-2" required />
        <textarea name="brief" placeholder="Describe the project brief" className="min-h-36 rounded border p-2" required />
        <Button type="submit">Generate Plan</Button>
      </form>
    </Card>
  );
}
