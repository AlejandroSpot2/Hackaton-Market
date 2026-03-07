import { RunWorkspace } from "@/components/run-workspace";

interface RunPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function RunPage({ params }: RunPageProps) {
  const { id } = await params;

  return (
    <main className="page-shell">
      <RunWorkspace runId={id} />
    </main>
  );
}