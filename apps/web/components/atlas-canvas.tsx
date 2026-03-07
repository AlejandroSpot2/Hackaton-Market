"use client";

import ReactFlow, {
  Background,
  Controls,
  Edge,
  Node,
  useNodesState,
  useEdgesState,
} from "reactflow";
import { MarketAtlas, NodeType } from "@/lib/types";
import { useEffect } from "react";

interface AtlasCanvasProps {
  atlas: MarketAtlas | null;
  selectedNodeId: string | null;
  onSelectNode: (nodeId: string) => void;
  isLoading?: boolean;
}

const tone: Record<NodeType, { border: string; bg: string; chip: string; glow: string }> = {
  idea: { border: "#f59e0b", bg: "rgba(245,158,11,0.1)", chip: "Idea", glow: "rgba(245,158,11,0.5)" },
  competitor: { border: "#22c55e", bg: "rgba(34,197,94,0.1)", chip: "Competitor", glow: "rgba(34,197,94,0.5)" },
  segment: { border: "#38bdf8", bg: "rgba(56,189,248,0.1)", chip: "Segment", glow: "rgba(56,189,248,0.5)" },
  adjacent_category: { border: "#f97316", bg: "rgba(249,115,22,0.1)", chip: "Adjacent", glow: "rgba(249,115,22,0.5)" },
  opportunity: { border: "#facc15", bg: "rgba(250,204,21,0.1)", chip: "Opportunity", glow: "rgba(250,204,21,0.5)" },
};

function buildNodes(atlas: MarketAtlas, selectedNodeId: string | null): Node[] {
  return atlas.nodes.map((n) => {
    const t = tone[n.type];
    const isSel = n.id === selectedNodeId;
    return {
      id: n.id,
      position: n.position,
      data: {
        label: (
          <div className="select-none">
            <span style={{ fontSize: 9, letterSpacing: "0.12em", textTransform: "uppercase", color: t.border, display: "block", marginBottom: 3 }}>
              {t.chip}
            </span>
            <span style={{ fontWeight: 700, fontSize: 13, lineHeight: 1.2, display: "block" }}>{n.label}</span>
            <span style={{ fontSize: 11, color: "#9ab0cc", lineHeight: 1.4, display: "block", marginTop: 4 }}>{n.market_signal}</span>
          </div>
        ),
      },
      style: {
        width: 190,
        borderRadius: 14,
        border: `1.5px solid ${isSel ? t.border : "rgba(99,120,170,0.28)"}`,
        background: isSel ? t.bg : "rgba(7,15,28,0.97)",
        color: "#eef2ff",
        padding: "10px 12px",
        boxShadow: isSel
          ? `0 0 0 2px ${t.glow}, 0 12px 36px rgba(0,0,0,0.6)`
          : "0 6px 20px rgba(0,0,0,0.5)",
        cursor: "pointer",
        transition: "border 0.25s, box-shadow 0.25s",
      },
    };
  });
}

function buildEdges(atlas: MarketAtlas): Edge[] {
  return atlas.edges.map((e) => ({
    id: e.id,
    source: e.source,
    target: e.target,
    label: e.label,
    animated: e.type === "competes_with" || e.type === "opportunity_in",
    style: {
      stroke:
        e.type === "competes_with" ? "rgba(248,113,113,0.55)" :
          e.type === "opportunity_in" ? "rgba(250,204,21,0.55)" :
            "rgba(99,120,170,0.45)",
      strokeWidth: 1.5,
    },
    labelStyle: { fill: "#8299b8", fontSize: 10 },
    labelBgStyle: { fill: "rgba(5,12,24,0.95)", fillOpacity: 1 },
  }));
}

function LoadingState() {
  return (
    <div className="flex flex-col items-center justify-center h-full gap-6">
      <div className="relative w-[90px] h-[90px] flex items-center justify-center">
        {/* Slow rotating outer ring */}
        <svg className="absolute inset-0 animate-spin-slow" width="90" height="90">
          <circle cx="45" cy="45" r="40" fill="none" stroke="rgba(56,189,248,0.1)" strokeWidth="1" />
          <circle cx="45" cy="45" r="40" fill="none" stroke="rgba(56,189,248,0.35)" strokeWidth="1"
            strokeDasharray="30 220" strokeLinecap="round" />
        </svg>
        {/* Nucleus */}
        <div className="w-12 h-12 rounded-full border border-sky-500/30 bg-sky-500/10 flex items-center justify-center text-2xl"
          style={{ boxShadow: "0 0 24px rgba(56,189,248,0.25)" }}>
          🧠
        </div>
        {/* Orbiting dots */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-2.5 h-2.5 rounded-full bg-amber-400" style={{ position: "absolute", top: "50%", left: "50%", marginTop: -5, marginLeft: -5, animation: "orbit 2.4s linear infinite" }} />
          <div className="w-2.5 h-2.5 rounded-full bg-emerald-400" style={{ position: "absolute", top: "50%", left: "50%", marginTop: -5, marginLeft: -5, animation: "orbit2 2.4s linear infinite" }} />
          <div className="w-2.5 h-2.5 rounded-full bg-violet-400" style={{ position: "absolute", top: "50%", left: "50%", marginTop: -5, marginLeft: -5, animation: "orbit3 2.4s linear infinite" }} />
        </div>
      </div>
      <div className="text-center">
        <p className="text-sm font-semibold text-slate-200">Building market atlas</p>
        <p className="text-xs text-muted font-mono mt-1 after:content-['█'] after:animate-typing-cursor">
          Scanning competitive landscape
        </p>
      </div>
    </div>
  );
}

function ReactFlowCanvas({ atlas, selectedNodeId, onSelectNode }: {
  atlas: MarketAtlas;
  selectedNodeId: string | null;
  onSelectNode: (id: string) => void;
}) {
  const [nodes, setNodes, onNodesChange] = useNodesState(buildNodes(atlas, selectedNodeId));
  const [edges, , onEdgesChange] = useEdgesState(buildEdges(atlas));

  // Sync node styles when selection changes (without resetting positions)
  useEffect(() => {
    setNodes((prev) =>
      prev.map((n) => {
        const original = atlas.nodes.find((an) => an.id === n.id);
        if (!original) return n;
        const t = tone[original.type];
        const isSel = n.id === selectedNodeId;
        return {
          ...n,
          style: {
            ...n.style,
            border: `1.5px solid ${isSel ? t.border : "rgba(99,120,170,0.28)"}`,
            background: isSel ? t.bg : "rgba(7,15,28,0.97)",
            boxShadow: isSel
              ? `0 0 0 2px ${t.glow}, 0 12px 36px rgba(0,0,0,0.6)`
              : "0 6px 20px rgba(0,0,0,0.5)",
          },
        };
      })
    );
  }, [selectedNodeId, atlas.nodes, setNodes]);

  return (
    <ReactFlow
      nodes={nodes}
      edges={edges}
      onNodesChange={onNodesChange}
      onEdgesChange={onEdgesChange}
      nodesDraggable={true}
      nodesConnectable={false}
      onNodeClick={(_, node) => onSelectNode(node.id)}
      fitView
      panOnScroll
      minZoom={0.25}
      maxZoom={2}
    >
      <Background color="rgba(99,120,170,0.07)" gap={24} />
      <Controls />
    </ReactFlow>
  );
}

export function AtlasCanvas({ atlas, selectedNodeId, onSelectNode, isLoading }: AtlasCanvasProps) {
  const hasNodes = atlas && atlas.nodes.length > 0;
  return (
    <div className="h-[520px] rounded-xl overflow-hidden border border-white/5 mt-3"
      style={{ background: "radial-gradient(ellipse at center, rgba(14,24,50,0.6) 0%, rgba(5,10,22,0.98) 100%)" }}>
      {isLoading || !hasNodes
        ? <LoadingState />
        : <ReactFlowCanvas atlas={atlas!} selectedNodeId={selectedNodeId} onSelectNode={onSelectNode} />
      }
    </div>
  );
}