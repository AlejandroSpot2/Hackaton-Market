import { RunWorkspace } from "@/components/run-workspace";

interface RunPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function RunPage({ params }: RunPageProps) {
  const { id } = await params;

  return (
    <main className="max-w-[1380px] mx-auto px-4 py-7 pb-16 overflow-x-hidden">
      <RunWorkspace runId={id} />
    </main>
  );
}