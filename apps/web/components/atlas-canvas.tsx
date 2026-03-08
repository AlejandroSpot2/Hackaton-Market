"use client";

import { useCallback, useEffect, useState } from "react";
import ReactFlow, {
  Background,
  BackgroundVariant,
  useNodesState,
  type Node,
  type Edge,
} from "reactflow";
import { MarketAtlas, AtlasNode } from "@/lib/types";

interface AtlasCanvasProps {
  atlas: MarketAtlas | null;
  selectedNodeId: string | null;
  onSelectNode: (id: string) => void;
  isLoading?: boolean;
}

const TYPE_COLORS: Record<string, string> = {
  idea: "#f59e0b",
  competitor: "#22c55e",
  segment: "#38bdf8",
  adjacent_category: "#f97316",
  opportunity: "#facc15",
};

// Vibrant palette for per-competitor unique colors
const COMP_PALETTE = ["#f87171", "#a78bfa", "#f97316", "#38bdf8", "#facc15", "#fb7185", "#e879f9", "#34d399"];
function hashCompColor(label: string): string {
  let h = 0; for (let i = 0; i < label.length; i++) h = (Math.imul(31, h) + label.charCodeAt(i)) | 0;
  return COMP_PALETTE[Math.abs(h) % COMP_PALETTE.length];
}

// Edge colors represent different relationship types
const EDGE_STYLES: Record<string, { stroke: string; animated: boolean; dash?: string }> = {
  competes_with:      { stroke: "rgba(248,113,113,0.6)",  animated: false, dash: "6 3" },
  belongs_to_segment: { stroke: "rgba(56,189,248,0.55)",  animated: false },
  adjacent_to:        { stroke: "rgba(249,115,22,0.55)",  animated: false, dash: "3 2" },
  opportunity_in:     { stroke: "rgba(34,197,94,0.6)",    animated: true  },
};

function hexRGB(hex: string) {
  const h = hex.replace("#", "");
  return `${parseInt(h.slice(0, 2), 16)},${parseInt(h.slice(2, 4), 16)},${parseInt(h.slice(4, 6), 16)}`;
}

function toFlowNodes(atlas: MarketAtlas, selectedNodeId: string | null): Node[] {
  return atlas.nodes.map((n: AtlasNode, i: number) => {
    const sel = n.id === selectedNodeId;
    // Selected = always green; competitors = unique color per name; others = type color
    const c = sel ? "#22c55e" : (n.type === "competitor" ? hashCompColor(n.label) : (TYPE_COLORS[n.type] ?? "#a78bfa"));
    return {
      id: n.id,
      position: n.position ?? { x: 80 + (i % 4) * 180, y: 60 + Math.floor(i / 4) * 130 },
      data: { label: n.label },
      draggable: true,
      type: "default",
      style: {
        background: sel ? `rgba(${hexRGB(c)},0.18)` : `rgba(${hexRGB(c)},0.08)`,
        border: sel ? `2px solid ${c}` : `1px solid ${c}66`,
        borderRadius: 12, padding: "10px 14px", fontSize: 12, fontWeight: 600,
        color: sel ? c : `${c}dd`, cursor: "pointer",
        boxShadow: sel ? `0 0 20px ${c}55` : `0 0 8px ${c}22`,
        transition: "all 0.25s",
      },
    };
  });
}

function toFlowEdges(atlas: MarketAtlas): Edge[] {
  return atlas.edges.map((e) => {
    const es = EDGE_STYLES[e.type] ?? { stroke: "rgba(167,139,250,0.4)", animated: false };
    return {
      id: e.id ?? `${e.source}-${e.target}`,
      source: e.source,
      target: e.target,
      animated: es.animated,
      style: { stroke: es.stroke, strokeWidth: 1.8, strokeDasharray: es.dash },
    };
  });
}

export function AtlasCanvas({ atlas, selectedNodeId, onSelectNode, isLoading }: AtlasCanvasProps) {
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [rfEdges, setRfEdges] = useState<Edge[]>([]);

  useEffect(() => {
    if (!atlas) return;
    setNodes((prev) => {
      const next = toFlowNodes(atlas, selectedNodeId);
      if (!prev.length) return next;
      return next.map((n) => {
        const old = prev.find((p) => p.id === n.id);
        return old ? { ...n, position: old.position } : n;
      });
    });
    setRfEdges(toFlowEdges(atlas));
  }, [atlas, selectedNodeId, setNodes]);

  const onNodeClick = useCallback((_: unknown, n: Node) => onSelectNode(n.id), [onSelectNode]);

  if (isLoading || !atlas) {
    return (
      <div style={{ height: 320, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", position: "relative" }}>
        <div style={{ width: 88, height: 88, borderRadius: "50%", border: "2px dashed rgba(56,189,248,0.3)", display: "flex", alignItems: "center", justifyContent: "center", position: "relative" }}>
          <span style={{ fontSize: 26 }}>🗺️</span>
        </div>
        <p style={{ fontSize: 12, color: "#7e90b8", marginTop: 16 }}>Building market atlas…</p>
      </div>
    );
  }

  return (
    <div style={{ height: 320, borderRadius: 12, overflow: "hidden" }}>
      <ReactFlow
        nodes={nodes}
        edges={rfEdges}
        onNodesChange={onNodesChange}
        onNodeClick={onNodeClick}
        fitView
        proOptions={{ hideAttribution: true }}
      >
        <Background variant={BackgroundVariant.Dots} gap={16} size={1} color="rgba(126,144,184,0.08)" />
      </ReactFlow>
    </div>
  );
}