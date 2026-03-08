"use client";

import { useParams } from "next/navigation";
import { RunWorkspace } from "@/components/run-workspace";

export default function RunPage() {
  const { id } = useParams<{ id: string }>();
  return (
    <div style={{
      minHeight: "100vh",
      background: "#050c18",
      fontFamily: "'Inter','Segoe UI',sans-serif",
      color: "#eef2ff",
      padding: "24px clamp(12px, 3vw, 32px)",
    }}>
      <div style={{ maxWidth: 1380, margin: "0 auto" }}>
        <RunWorkspace runId={id} />
      </div>
    </div>
  );
}